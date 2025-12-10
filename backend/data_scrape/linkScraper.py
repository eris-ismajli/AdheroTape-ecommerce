import json
import os
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "https://www.brontapes.com"
OUTPUT_FILE = "brontapes_urls.json"

CATEGORIES = {
    "Double Sided": "double-sided",
    "Duct Tape": "duct-tape",
    "Filament Tape": "filament-tape",
    "Foam Tape": "foam-tape",
    "Gaffers Tape": "gaffers-tape",
    "High Bond Tape": "high-bond",
    "Masking Tape": "masking-tape",
    "Poly Tape": "poly-tape",
    "Vinyl Tape": "vinyl-tape",
    "Carton Seal": "carton-seal",
    "3M Safety": "3M-safety",
    "GaffGun": "gaffgun"
}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}


# ============================================================
# FILE HELPERS
# ============================================================

def load_progress():
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            print("[INFO] Loaded previous progress.")
            return json.load(f)
    return {}


def save_progress(data):
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print("[✓] Progress saved.")


# ============================================================
# SCRAPING HELPERS
# ============================================================

def get_soup(url):
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")


def extract_links_bs(soup):
    links = []
    for a in soup.select("a[href*='BT-']"):
        href = a.get("href", "")
        if href.startswith("/") and "BT-" in href.upper():
            links.append(urljoin(BASE_URL, href))
    return list(dict.fromkeys(links))


def extract_links_selenium(driver):
    time.sleep(2)
    elems = driver.find_elements(By.CSS_SELECTOR, "a[href*='BT-']")
    links = {e.get_attribute("href") for e in elems if "/BT-" in e.get_attribute("href")}
    return list(links)


# ============================================================
# CATEGORY SCRAPER
# ============================================================

def scrape_category(cat_name, slug, db, driver):
    print(f"\n=== SCRAPING CATEGORY: {cat_name} ===")

    url = f"{BASE_URL}/shop/{slug}/"
    print(f"[GET] {url}")

    soup = get_soup(url)
    links = extract_links_bs(soup)

    if links:
        print(f"  → Found {len(links)} URLs (STATIC)")
        db[cat_name] = links
        save_progress(db)
        return links

    print("  [FALLBACK] JS scraping via Selenium...")
    driver.get(url)
    links = extract_links_selenium(driver)

    if links:
        print(f"  → Found {len(links)} URLs (SELENIUM)")
        db[cat_name] = links
        save_progress(db)
        return links

    print("  !! NO LINKS FOUND !!")
    db[cat_name] = []
    save_progress(db)
    return []


# ============================================================
# MAIN
# ============================================================

def main():
    db = load_progress()

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=chrome_options
    )

    for cat_name, slug in CATEGORIES.items():
        if cat_name in db and db[cat_name]:
            print(f"[SKIP] {cat_name} already scraped")
            continue
        scrape_category(cat_name, slug, db, driver)
        time.sleep(1)

    driver.quit()
    print("\n✔ DONE. Scraped categories:")
    print(json.dumps(list(db.keys()), indent=2))


if __name__ == "__main__":
    main()
