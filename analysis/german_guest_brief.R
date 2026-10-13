# ==============================================================================
# german_guest_brief.R
# Cape Hospitality Advisors - 24h desk brief: what German-speaking guests say
# about ONE hotel, from Booking.com reviews scraped with Apify.
#
# Principles (so the brief survives a sceptical buyer):
#   - Every number is counted from the scraped reviews, with its sample size.
#   - Gemini only tags which topics a review praises or complains about; a tag
#     counts only if Gemini also returns a phrase found word for word in that
#     review. Without a Gemini key, a stricter keyword method is used instead.
#   - Complaints come from Booking's "disliked" text, praise from "liked".
#   - Missing ratings/dates stay missing (never filled with defaults).
#   - Reviewer names are dropped; only country, date, rating and text are kept.
#
# Output (in briefs/<hotel-slug>/):
#   brief_draft.html    draft brief for the analyst to check and send
#   reviews_tagged.csv  review-level audit trail (every count traces back here)
#   summary.json        the headline numbers
# ==============================================================================

# ---- 0. Settings --------------------------------------------------------------
HOTEL_URL   <- "https://www.booking.com/hotel/za/the-twelve-apostles-hotel-and-spa.html"
HOTEL_NAME  <- "The Twelve Apostles Hotel & Spa"
MAX_REVIEWS <- 800   # newest reviews, ALL languages (needed to compare German vs other guests)
REFRESH     <- FALSE  # TRUE = ignore the cached scrape and pay for a new one

# Command line overrides: Rscript german_guest_brief.R "<booking url>" "<hotel name>" [max_reviews] [refresh]
args <- commandArgs(trailingOnly = TRUE)
if (length(args) >= 1) HOTEL_URL   <- args[1]
if (length(args) >= 2) HOTEL_NAME  <- args[2]
if (length(args) >= 3) MAX_REVIEWS <- as.integer(args[3])
if (length(args) >= 4) REFRESH     <- tolower(args[4]) %in% c("true", "1", "yes", "refresh")

APIFY_TOKEN  <- Sys.getenv("CAPE_HOTEL_APIFY_KEY")
GEMINI_TOKEN <- Sys.getenv("CAPE_HOTEL_AUDIT_KEY")
GEMINI_MODEL <- Sys.getenv("CAPE_GEMINI_MODEL", "gemini-3.8-flash")
ACTOR_ID     <- Sys.getenv("CAPE_APIFY_ACTOR", "solidcode~booking-reviews-scraper")
APIFY_BASE   <- Sys.getenv("CAPE_APIFY_BASE", "https://api.apify.com")
GEMINI_BASE  <- Sys.getenv("CAPE_GEMINI_BASE", "https://generativelanguage.googleapis.com")
OUT_ROOT     <- Sys.getenv("CAPE_BRIEFS_DIR", "briefs")

# Countries counted as German-speaking guests (Booking shows reviewer country).
DACH_COUNTRIES <- c("germany", "deutschland", "austria", "osterreich", "oesterreich",
                    "switzerland", "schweiz", "suisse", "svizzera", "liechtenstein")

# Topics tagged in every review. Keys are stable; labels appear in the brief.
TOPICS <- c(
  noise          = "Noise / Lärm",
  cleanliness    = "Cleanliness / Sauberkeit",
  hot_water      = "Hot water & shower / Warmwasser & Dusche",
  aircon         = "Air-con & heating / Klimaanlage & Heizung",
  wifi           = "Wi-Fi / WLAN",
  safety         = "Safety & security / Sicherheit",
  power          = "Power cuts / Stromausfall",
  room_condition = "Room condition & maintenance / Zimmerzustand",
  beds           = "Beds & sleep / Betten & Schlafkomfort",
  breakfast      = "Breakfast / Frühstück",
  food           = "Restaurant & food / Restaurant & Essen",
  staff          = "Staff & service / Personal & Service",
  checkin        = "Check-in & arrival / Check-in & Anreise",
  location       = "Location & views / Lage & Aussicht",
  value          = "Value for money / Preis-Leistung",
  parking        = "Parking / Parken",
  pool_spa       = "Pool & spa / Pool & Spa",
  family         = "Family-friendliness / Familienfreundlichkeit"
)
# The fixed risk checklist always shown, even when the count is zero.
RISK_TOPICS <- c("noise", "hot_water", "cleanliness", "aircon", "wifi", "safety", "power")

# What an inspector should test on site when German guests complain about a topic.
ONSITE_CHECKS <- c(
  noise          = "Night-time noise check in street- and plant-facing rooms; ask which wings tour groups are allocated.",
  cleanliness    = "Bathroom and linen inspection in standard (not upgraded) rooms; check under beds and grout.",
  hot_water      = "Hot-water test at peak time (07:00-08:30): time to temperature and pressure on upper floors.",
  aircon         = "Run air-con/heating in the allocated room type; listen for noise, check for odour and thermostat control.",
  wifi           = "Speed test in rooms (not lobby) at evening peak.",
  safety         = "Walk the arrival route and grounds after dark; check locks, safes, balcony doors and access control.",
  power          = "Ask for backup-power coverage (rooms, hot water, lifts, Wi-Fi) during load-shedding; observe a switchover if scheduled.",
  room_condition = "Inspect wear in the room category contracted (fixtures, furniture, damp, finishes).",
  beds           = "Check mattress condition, pillow options and blackout in the contracted room type.",
  breakfast      = "Observe breakfast at peak: queueing, replenishment, hot-food quality, dietary options.",
  food           = "Dinner service: pacing, temperature, menu consistency.",
  staff          = "Note greeting, language ability (German/English) and problem handling during check-in and requests.",
  checkin        = "Time check-in at group arrival times; luggage handling and room readiness.",
  value          = "Compare inclusions with the catalogue description and current room rates.",
  parking        = "Check parking availability, cost and security.",
  pool_spa       = "Check pool/spa opening hours, cleanliness, towel service and capacity at peak.",
  family         = "Check family rooms, child facilities, pool safety (fencing/depth signage).",
  location       = "Verify catalogue claims (distances, views, walkability) against reality."
)

# ---- 1. Packages ----------------------------------------------------------------
pkgs <- c("httr", "jsonlite", "dplyr", "stringr", "stringi", "lubridate", "tidyr", "purrr")
missing_pkgs <- pkgs[!vapply(pkgs, requireNamespace, logical(1), quietly = TRUE)]
if (length(missing_pkgs)) install.packages(missing_pkgs)
suppressPackageStartupMessages({
  library(httr); library(jsonlite); library(dplyr); library(stringr)
  library(lubridate); library(tidyr); library(purrr)
})

`%||%` <- function(a, b) if (is.null(a)) b else a

slug <- str_replace_all(str_to_lower(HOTEL_NAME), "[^a-z0-9]+", "-") |> str_replace_all("^-|-$", "")
out_dir <- file.path(OUT_ROOT, slug)
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)
cache_file <- file.path(out_dir, "raw_reviews.rds")

# ---- 2. Scrape (cached per hotel) ---------------------------------------------
apify_get <- function(path) {
  res <- GET(paste0(APIFY_BASE, path), add_headers(Authorization = paste("Bearer", APIFY_TOKEN)), timeout(60))
  if (status_code(res) >= 300) stop("Apify ", status_code(res), ": ", content(res, as = "text", encoding = "UTF-8"))
  res
}
as_json <- function(res) fromJSON(content(res, as = "text", encoding = "UTF-8"), simplifyVector = FALSE)

scrape_reviews <- function() {
  if (APIFY_TOKEN == "") stop("Set CAPE_HOTEL_APIFY_KEY in your .Renviron.")
  # Check the actor's Input tab in Apify if a field name differs; extra keys are ignored by most actors.
  payload <- list(
    startUrls          = list(list(url = HOTEL_URL)),
    maxReviewsPerHotel = MAX_REVIEWS,
    maxReviews         = MAX_REVIEWS,
    sortBy             = "newest"
  )
  message("Starting Apify run for ", HOTEL_NAME, " ...")
  res <- POST(paste0(APIFY_BASE, "/v2/acts/", ACTOR_ID, "/runs"),
              add_headers(Authorization = paste("Bearer", APIFY_TOKEN)),
              body = payload, encode = "json", timeout(60))
  run <- tryCatch(as_json(res)$data, error = function(e) NULL)
  if (is.null(run$id)) stop("Apify did not start: ", content(res, as = "text", encoding = "UTF-8"))

  started <- Sys.time()
  repeat {
    Sys.sleep(10)
    status <- as_json(apify_get(paste0("/v2/actor-runs/", run$id)))$data$status
    message("  status: ", status)
    if (status %in% c("SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT")) break
    if (difftime(Sys.time(), started, units = "mins") > 30) stop("Apify run took over 30 minutes; check the Apify console.")
  }
  if (status != "SUCCEEDED") stop("Apify run ended with status ", status)

  items <- apify_get(paste0("/v2/datasets/", run$defaultDatasetId, "/items?format=json&clean=1"))
  df <- fromJSON(content(items, as = "text", encoding = "UTF-8"), flatten = TRUE)
  if (!is.data.frame(df) || nrow(df) == 0) stop("Apify returned no reviews. Check the hotel URL.")
  df
}

raw <- if (file.exists(cache_file) && !REFRESH) {
  message("Using cached scrape: ", cache_file); readRDS(cache_file)
} else {
  df <- scrape_reviews(); saveRDS(df, cache_file); df
}

# ---- 3. Map columns (scraper field names vary) ----------------------------------
pick <- function(df, exact, pattern = NULL) {
  cols <- names(df)
  hit <- cols[tolower(cols) %in% tolower(exact)]
  if (!length(hit) && !is.null(pattern)) hit <- cols[str_detect(cols, regex(pattern, ignore_case = TRUE))]
  if (length(hit)) hit[1] else NA_character_
}
col_or_na <- function(df, col) if (is.na(col)) rep(NA_character_, nrow(df)) else as.character(df[[col]])

cols <- list(
  liked    = pick(raw, c("likedText", "liked", "positiveText", "positive", "pros"), "liked|positive"),
  disliked = pick(raw, c("dislikedText", "disliked", "negativeText", "negative", "cons"), "disliked|negative"),
  text     = pick(raw, c("reviewText", "text", "content", "comment"), "reviewtext|^text$"),
  title    = pick(raw, c("reviewTitle", "title"), "reviewtitle"),
  rating   = pick(raw, c("rating", "reviewScore", "score", "ratingScore"), "score|rating"),
  date     = pick(raw, c("reviewDate", "date", "publishedDate", "submissionDate"), "reviewdate|published"),
  country  = pick(raw, c("reviewerCountry", "userLocation", "nationality", "country", "reviewerNationality"), "country|nationality|location"),
  language = pick(raw, c("reviewLanguage", "language", "lang"), "language"),
  traveler = pick(raw, c("travelerType", "travellerType", "customerType", "tripType", "guestType"), "traveler|traveller|customertype|triptype"),
  room     = pick(raw, c("roomInfo", "roomType", "room", "roomName"), "^room")
)
message("Column mapping: ", paste(names(cols), unlist(cols), sep = "=", collapse = ", "))
if (all(is.na(c(cols$liked, cols$disliked, cols$text)))) stop("No review text column found; inspect names(raw).")

# Rough language check for reviews without a language field: share of German function words.
DE_WORDS <- c("der", "die", "das", "und", "ist", "nicht", "sehr", "wir", "war", "waren", "ein", "eine",
              "mit", "für", "auf", "auch", "zu", "im", "den", "dem", "es", "aber", "sind", "hatten",
              "uns", "zum", "zur", "kein", "keine", "leider", "wurde", "gibt", "noch", "nur", "man")
looks_german <- function(txt) {
  w <- str_split(str_to_lower(coalesce(txt, "")), "[^\\p{L}]+")
  vapply(w, function(x) { x <- x[nzchar(x)]; length(x) >= 6 && mean(x %in% DE_WORDS) >= 0.15 }, logical(1))
}

parse_rating <- function(x) suppressWarnings(as.numeric(str_replace(str_extract(x, "[0-9]+([.,][0-9]+)?"), ",", ".")))
parse_date <- function(x) as.Date(suppressWarnings(parse_date_time(x, orders = c("Ymd HMS", "Ymd", "dmY", "mdY", "B d, Y", "d B Y", "B Y"))))

reviews <- tibble(
  id        = seq_len(nrow(raw)),
  date      = parse_date(col_or_na(raw, cols$date)),
  rating    = parse_rating(col_or_na(raw, cols$rating)),
  country   = str_squish(col_or_na(raw, cols$country)),
  language  = str_to_lower(col_or_na(raw, cols$language)),
  traveler  = str_squish(col_or_na(raw, cols$traveler)),
  room      = str_squish(col_or_na(raw, cols$room)),
  liked     = str_squish(coalesce(col_or_na(raw, cols$liked), "")),
  disliked  = str_squish(coalesce(col_or_na(raw, cols$disliked), "")),
  text      = str_squish(coalesce(col_or_na(raw, cols$text), ""))
) %>%
  mutate(
    # Single-text sources: use the full text for both praise and complaints.
    liked    = if_else(liked == "" & disliked == "", text, liked),
    disliked = if_else(disliked == "" & is.na(cols$disliked), text, disliked),
    all_text = str_squish(paste(liked, disliked)),
    country_norm = str_to_lower(stringi::stri_trans_general(coalesce(country, ""), "Latin-ASCII")),
    dach_country = country_norm %in% DACH_COUNTRIES,
    german_text  = if (all(is.na(language))) looks_german(all_text) else str_detect(coalesce(language, ""), "^de"),
    german_guest = dach_country | german_text,
    written      = nchar(all_text) >= 15
  ) %>%
  distinct(date, rating, all_text, .keep_all = TRUE)

scale_max <- if (isTRUE(max(reviews$rating, na.rm = TRUE) > 5)) 10 else 5

# ---- 4. Topic tagging -------------------------------------------------------------
squash <- function(s) str_to_lower(str_squish(coalesce(s, "")))

gemini_batch <- function(batch) {
  items <- lapply(seq_len(nrow(batch)), function(i) list(
    id = batch$id[i], liked = str_sub(batch$liked[i], 1, 900), disliked = str_sub(batch$disliked[i], 1, 900)))
  prompt <- paste0(
    "You tag hotel guest reviews for a hotel quality brief. Reviews (JSON):\n", toJSON(items, auto_unbox = TRUE),
    "\n\nAllowed topics: ", paste(names(TOPICS), collapse = ", "),
    "\nReturn JSON: {\"reviews\":[{\"id\":number,\"complaints\":[{\"topic\":string,\"quote\":string}],",
    "\"praise\":[{\"topic\":string,\"quote\":string}]}]}",
    "\nRules: complaints only from \"disliked\" text, praise only from \"liked\" text. ",
    "Each quote must be a short phrase copied EXACTLY from that text, in its original language. ",
    "Only tag what the guest clearly says. Use [] when nothing applies. No other topics, no commentary."
  )
  body <- list(contents = list(list(parts = list(list(text = prompt)))),
               generationConfig = list(temperature = 0, responseMimeType = "application/json"))
  url <- paste0(GEMINI_BASE, "/v1beta/models/", GEMINI_MODEL, ":generateContent")
  for (attempt in 1:6) {
    res <- tryCatch(POST(url, add_headers(`x-goog-api-key` = GEMINI_TOKEN), body = body, encode = "json", timeout(90)),
                    error = function(e) NULL)
    if (!is.null(res) && status_code(res) == 200) {
      txt <- tryCatch(as_json(res)$candidates[[1]]$content$parts[[1]]$text, error = function(e) NULL)
      if (is.null(txt)) txt <- ""
      out <- tryCatch(fromJSON(txt, simplifyVector = FALSE)$reviews, error = function(e) NULL)
      if (!is.null(out)) return(out)
    }
    if (!is.null(res) && status_code(res) %in% c(400, 401, 403, 404)) {
      warning("Gemini rejected the request (", status_code(res), "): check CAPE_HOTEL_AUDIT_KEY and CAPE_GEMINI_MODEL. ",
              content(res, as = "text", encoding = "UTF-8"))
      break
    }
    retry_after <- if (!is.null(res)) suppressWarnings(as.numeric(headers(res)[["retry-after"]])) else NA
    wait <- if (!is.null(res) && status_code(res) == 429) (if (length(retry_after) && !is.na(retry_after)) retry_after else 60) else 5 * attempt
    message("  Gemini retry in ", wait, "s (", if (is.null(res)) "network" else status_code(res), ")")
    Sys.sleep(wait)
  }
  warning("Gemini failed for a batch of ", nrow(batch), " reviews; they are left untagged.")
  NULL
}

# Keep a tag only if the topic is allowed and the quote really appears in the right text.
verify_tags <- function(raw_tags, batch) {
  rows <- list()
  for (r in raw_tags) {
    id <- suppressWarnings(as.integer(r$id))
    if (is.na(id) || !(id %in% batch$id)) next
    rev <- batch[batch$id == id, ]
    for (kind in c("complaints", "praise")) {
      source_text <- if (kind == "complaints") rev$disliked else rev$liked
      for (t in r[[kind]] %||% list()) {
        topic <- as.character(t$topic %||% ""); quote <- str_squish(as.character(t$quote %||% ""))
        if (!(topic %in% names(TOPICS)) || nchar(quote) < 4) next
        if (!str_detect(squash(source_text), fixed(squash(quote)))) next
        rows[[length(rows) + 1]] <- tibble(id = id, kind = if (kind == "complaints") "complaint" else "praise",
                                           topic = topic, quote = quote)
      }
    }
  }
  bind_rows(rows)
}

# Fallback without Gemini: whole-word German/English keywords, complaints from disliked text only.
KEYWORDS <- list(
  noise = "laut|lärm|laerm|krach|hellhörig|hellhoerig|noisy|noise|loud",
  cleanliness = "schmutzig|dreckig|unsauber|schimmel|staub|flecken?|haare|ungeziefer|kakerlaken?|dirty|mould|mold|stain(ed|s)?|cockroach(es)?",
  hot_water = "kaltes? wasser|kein warm(es)? wasser|lauwarm|wasserdruck|cold water|no hot water|lukewarm|water pressure",
  aircon = "klimaanlage|heizung|air ?con(ditioning)?|heating",
  wifi = "wlan|wifi|wi-fi|internet",
  safety = "unsicher|gestohlen|diebstahl|einbruch|unsafe|stolen|theft|break-in",
  power = "stromausfall|load ?shedding|power cut|power outage|kein strom|no power|generator"
)
keyword_tags <- function(df) {
  bind_rows(lapply(names(KEYWORDS), function(k) {
    hit <- str_detect(str_to_lower(df$disliked), regex(paste0("\\b(", KEYWORDS[[k]], ")\\b")))
    if (!any(hit)) return(NULL)
    tibble(id = df$id[hit], kind = "complaint", topic = k,
           quote = str_extract(df$disliked[hit], regex(paste0("[^.!?]*\\b(", KEYWORDS[[k]], ")\\b[^.!?]*"), ignore_case = TRUE)))
  }))
}

to_tag <- reviews %>% filter(written)
if (GEMINI_TOKEN != "") {
  method <- paste0("Gemini (", GEMINI_MODEL, ") topic tags, each backed by a verbatim quote")
  batches <- split(to_tag, ceiling(seq_len(nrow(to_tag)) / 25))
  message("Tagging ", nrow(to_tag), " written reviews with Gemini in ", length(batches), " batches ...")
  untagged_ids <- integer()
  tags <- bind_rows(imap(batches, function(b, i) {
    message("  batch ", i, "/", length(batches))
    if (i > 1) Sys.sleep(8)  # stay under per-minute limits
    out <- gemini_batch(b)
    if (is.null(out)) { untagged_ids <<- c(untagged_ids, b$id); return(NULL) }
    verify_tags(out, b)
  }))
} else {
  method <- "Keyword matching on 'disliked' text (no Gemini key set): complaints only, rougher than AI tagging"
  message("No Gemini key: using keyword method.")
  tags <- keyword_tags(to_tag)
  untagged_ids <- integer()
}
if (nrow(tags) == 0) tags <- tibble(id = integer(), kind = character(), topic = character(), quote = character())
tags <- tags %>% distinct(id, kind, topic, .keep_all = TRUE)

# ---- 5. Numbers (all counted here) ------------------------------------------------
fmt <- function(x, d = 1) ifelse(is.na(x), "–", formatC(x, format = "f", digits = d))
pct <- function(a, b) if (b > 0) 100 * a / b else NA_real_

ger <- reviews %>% filter(german_guest)
oth <- reviews %>% filter(!german_guest)
ger_w <- ger %>% filter(written); oth_w <- oth %>% filter(written)
latest <- suppressWarnings(max(reviews$date, na.rm = TRUE))
if (!is.finite(latest)) latest <- NA

rating_test <- if (sum(!is.na(ger$rating)) >= 10 && sum(!is.na(oth$rating)) >= 10)
  suppressWarnings(wilcox.test(ger$rating, oth$rating)$p.value) else NA_real_

window_mean <- function(df, from, to) {
  x <- df %>% filter(!is.na(date), date > from, date <= to)
  list(n = nrow(x), mean = if (sum(!is.na(x$rating))) mean(x$rating, na.rm = TRUE) else NA_real_)
}
last12 <- window_mean(ger, latest - years(1), latest)
prev12 <- window_mean(ger, latest - years(2), latest - years(1))

topic_table <- function(kind_wanted) {
  counts <- tags %>% filter(kind == kind_wanted) %>%
    mutate(german = id %in% ger$id) %>%
    group_by(topic) %>%
    summarise(n_ger = n_distinct(id[german]), n_oth = n_distinct(id[!german]), .groups = "drop")
  tibble(topic = names(TOPICS)) %>% left_join(counts, by = "topic") %>%
    mutate(across(c(n_ger, n_oth), ~ coalesce(.x, 0L)),
           pct_ger = 100 * n_ger / max(1, nrow(ger_w)),
           pct_oth = 100 * n_oth / max(1, nrow(oth_w)),
           label = TOPICS[topic])
}
complaints <- topic_table("complaint")
praise     <- topic_table("praise")

pick_quotes <- function(topic_key, kind_wanted, k = 2) {
  tags %>% filter(topic == topic_key, kind == kind_wanted, id %in% ger$id) %>%
    left_join(reviews %>% select(id, date, rating), by = "id") %>%
    arrange(desc(date)) %>% distinct(quote, .keep_all = TRUE) %>% head(k)
}

by_traveler <- ger %>% filter(!is.na(traveler), traveler != "") %>%
  group_by(traveler) %>% summarise(n = n(), mean_rating = mean(rating, na.rm = TRUE), .groups = "drop") %>%
  filter(n >= 3) %>% arrange(desc(n))

summary_out <- list(
  hotel = HOTEL_NAME, source = HOTEL_URL, generated = format(Sys.Date()), method = method,
  reviews_total = nrow(reviews), german_guests = nrow(ger), german_written = nrow(ger_w),
  german_by_country = sum(ger$dach_country), german_by_language = sum(ger$german_text),
  date_from = format(suppressWarnings(min(reviews$date, na.rm = TRUE))), date_to = format(latest),
  rating_scale = scale_max,
  rating_german = mean(ger$rating, na.rm = TRUE), rating_other = mean(oth$rating, na.rm = TRUE),
  rating_difference_p_value = rating_test,
  german_last12 = last12, german_prev12 = prev12,
  untagged_reviews = length(untagged_ids), untagged_german = sum(untagged_ids %in% ger$id),
  complaints = complaints %>% filter(n_ger > 0) %>% select(topic, n_ger, pct_ger, n_oth, pct_oth),
  praise = praise %>% filter(n_ger > 0) %>% select(topic, n_ger, pct_ger, n_oth, pct_oth)
)
write_json(summary_out, file.path(out_dir, "summary.json"), auto_unbox = TRUE, pretty = TRUE, digits = 3, na = "null")

reviews %>%
  left_join(tags %>% group_by(id) %>% summarise(
    complaints = paste(unique(topic[kind == "complaint"]), collapse = "; "),
    praise     = paste(unique(topic[kind == "praise"]), collapse = "; "), .groups = "drop"), by = "id") %>%
  select(id, date, rating, country, german_guest, traveler, room, liked, disliked, complaints, praise) %>%
  write.csv(file.path(out_dir, "reviews_tagged.csv"), row.names = FALSE, na = "", fileEncoding = "UTF-8")

# ---- 6. Draft brief (HTML) -------------------------------------------------------
esc <- function(x) { x <- gsub("&", "&amp;", x, fixed = TRUE); x <- gsub("<", "&lt;", x, fixed = TRUE); gsub(">", "&gt;", x, fixed = TRUE) }
quote_html <- function(q) if (!nrow(q)) "" else paste0(
  "<ul class='q'>", paste0("<li>&ldquo;", esc(q$quote), "&rdquo; <span>", ifelse(is.na(q$date), "", format(q$date, "%b %Y")),
                           ifelse(is.na(q$rating), "", paste0(", ", fmt(q$rating, 0), "/", scale_max)), "</span></li>", collapse = ""), "</ul>")

topic_rows <- function(tbl, kind_wanted, top = 6) {
  rows <- tbl %>% filter(n_ger > 0) %>% arrange(desc(n_ger)) %>% head(top)
  if (!nrow(rows)) return(if (any(untagged_ids %in% ger$id)) "<p class='muted'>Not available: some German-guest reviews could not be tagged (see warning above).</p>" else "<p class='muted'>None mentioned by German-speaking guests in this sample.</p>")
  paste0(vapply(seq_len(nrow(rows)), function(i) paste0(
    "<div class='topic'><b>", esc(rows$label[i]), "</b> &mdash; ", rows$n_ger[i], " of ", nrow(ger_w),
    " German reviews (", fmt(rows$pct_ger[i], 0), "%; other guests ", fmt(rows$pct_oth[i], 0), "%)",
    quote_html(pick_quotes(rows$topic[i], kind_wanted)), "</div>"), character(1)), collapse = "")
}

risk_rows <- paste0(vapply(RISK_TOPICS, function(k) {
  r <- complaints[complaints$topic == k, ]
  cls <- if (r$n_ger == 0) "ok" else if (r$n_ger >= 3) "bad" else "warn"
  paste0("<tr class='", cls, "'><td>", esc(TOPICS[[k]]), "</td><td>", r$n_ger, " / ", nrow(ger_w), "</td><td>",
         r$n_oth, " / ", nrow(oth_w), "</td></tr>")
}, character(1)), collapse = "")

# On-site checks: complaint topics German guests raise at least twice, or clearly more often than others.
flagged <- complaints %>% filter(n_ger >= 2 | (n_ger >= 1 & pct_ger >= 2 * pct_oth & nrow(ger_w) >= 10)) %>% arrange(desc(n_ger))
onsite_html <- if (!nrow(flagged)) "<p>No recurring German-guest complaint in this sample. A standard on-site audit is still recommended before contracting.</p>" else
  paste0("<ol>", paste0("<li><b>", esc(flagged$label), ":</b> ", esc(ONSITE_CHECKS[flagged$topic]),
                        " <span class='muted'>(", flagged$n_ger, " German complaint", ifelse(flagged$n_ger == 1, "", "s"), ")</span></li>", collapse = ""), "</ol>")

traveler_html <- if (!nrow(by_traveler)) "<p class='muted'>Traveller type not available or too few reviews per group.</p>" else
  paste0("<table><tr><th>Traveller type</th><th>German reviews</th><th>Average rating</th></tr>",
         paste0("<tr><td>", esc(by_traveler$traveler), "</td><td>", by_traveler$n, "</td><td>", fmt(by_traveler$mean_rating), "</td></tr>", collapse = ""),
         "</table>")

trend_txt <- if (last12$n >= 5 && prev12$n >= 5)
  paste0(fmt(last12$mean), " in the last 12 months (", last12$n, " reviews) vs ", fmt(prev12$mean), " in the 12 months before (", prev12$n, ")") else
  paste0(last12$n, " German reviews in the last 12 months; too few to compare periods reliably")

diff_note <- if (is.na(rating_test)) "Too few reviews in one group to test the difference." else
  if (rating_test < 0.05) "The difference is unlikely to be chance (p < 0.05)." else "The difference may be chance (not statistically significant)."

untagged_box <- if (length(untagged_ids)) paste0("<div class='warn-box'><b>Incomplete:</b> Gemini could not tag ", length(untagged_ids),
  " written reviews (", sum(untagged_ids %in% ger$id), " from German-speaking guests). Topic counts below are too low. Re-run the script; the cached scrape is reused at no Apify cost.</div>") else ""

small_sample <- if (nrow(ger_w) < 20) paste0("<div class='warn-box'>Only ", nrow(ger_w),
  " written reviews from German-speaking guests: treat counts as indicative, not representative.</div>") else ""

html <- paste0('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Desk Brief - ', esc(HOTEL_NAME), '</title><style>
body{font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;color:#1e293b;max-width:820px;margin:24px auto;padding:0 16px;font-size:10.5pt;line-height:1.45}
h1{font-size:18pt;margin:0;color:#10213a}h2{font-size:12pt;color:#10213a;border-bottom:1px solid #cbd5e1;padding-bottom:2px;margin-top:20px}
.meta,.muted,.q span{color:#64748b;font-size:9pt}.draft{background:#fef3c7;border:1px solid #fcd34d;padding:6px 10px;border-radius:4px;font-size:9pt}
.kpis{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0}.kpi{flex:1;min-width:150px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px 10px}
.kpi b{display:block;font-size:15pt;color:#10213a}.topic{margin:8px 0}.q{margin:3px 0 0 0;font-style:italic}
table{border-collapse:collapse;width:100%;margin:6px 0}td,th{border-bottom:1px solid #e2e8f0;padding:4px 6px;text-align:left}th{background:#f1f5f9}
tr.ok td:first-child:before{content:"\\2714  ";color:#16a34a}tr.warn td:first-child:before{content:"\\26A0  ";color:#d97706}tr.bad td:first-child:before{content:"\\26A0  ";color:#dc2626}
.warn-box{background:#fff7ed;border-left:4px solid #f97316;padding:6px 10px;margin:8px 0}
</style></head><body>
<div class="draft">DRAFT for analyst review: check the quotes and wording before sending.</div>
<h1>Desk Brief: ', esc(HOTEL_NAME), '</h1>
<div class="meta">What German-speaking guests say on Booking.com &middot; ', nrow(reviews), ' latest reviews (',
  esc(summary_out$date_from), ' to ', esc(summary_out$date_to), ') &middot; prepared ', format(Sys.Date(), "%d %b %Y"), ' by Cape Hospitality Advisors</div>
', untagged_box, small_sample, '
<div class="kpis">
 <div class="kpi"><b>', nrow(ger), ' of ', nrow(reviews), '</b>reviews from German-speaking guests (', fmt(pct(nrow(ger), nrow(reviews)), 0), '%)</div>
 <div class="kpi"><b>', fmt(summary_out$rating_german), ' / ', scale_max, '</b>German guests&rsquo; average vs ', fmt(summary_out$rating_other), ' from other guests</div>
 <div class="kpi"><b>', last12$n, '</b>German reviews in the 12 months to ', format(latest, "%b %Y"), '</div>
</div>
<p class="muted">', diff_note, ' Rating trend for German guests: ', trend_txt, '.</p>

<h2>Risk checklist (complaints in written reviews)</h2>
<table><tr><th>Topic</th><th>German-speaking guests</th><th>Other guests</th></tr>', risk_rows, '</table>

<h2>What German-speaking guests complain about</h2>', topic_rows(complaints, "complaint"), '
<h2>What German-speaking guests praise</h2>', if (GEMINI_TOKEN == "") "<p class='muted'>Praise is only tagged with a Gemini key.</p>" else topic_rows(praise, "praise", 5), '
<h2>By traveller type</h2>', traveler_html, '
<h2>Recommended checks for an on-site audit</h2>', onsite_html, '

<h2>Method and limits</h2>
<p class="muted">Source: Booking.com guest reviews for this property, collected on ', format(Sys.Date(), "%d %b %Y"),
  ' (newest first). German-speaking guests = reviewer country Germany, Austria or Switzerland, or review written in German (',
  summary_out$german_by_country, ' by country, ', summary_out$german_by_language, ' by language, some overlap). Topics: ', esc(method),
  '. Complaints are taken from what guests disliked, praise from what they liked. Counts show how many written reviews mention a topic. ',
  'Quotes are verbatim. This is a desk analysis of public reviews: it shows patterns to verify, not confirmed defects, and it is not a certification.</p>
</body></html>')

writeLines(enc2utf8(html), file.path(out_dir, "brief_draft.html"), useBytes = TRUE)

if (length(untagged_ids)) message("WARNING: ", length(untagged_ids), " reviews left untagged by Gemini; re-run to complete.")
message("\nDone: ", nrow(reviews), " reviews (", nrow(ger), " German-speaking, ", nrow(ger_w), " written).")
message("Files in ", normalizePath(out_dir), ": brief_draft.html, reviews_tagged.csv, summary.json")
