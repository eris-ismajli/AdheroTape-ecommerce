import json
import time
import re
import os  # ← YOU FORGOT THIS
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.brontapes.com"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    )
}

INPUT_FILE = "brontapes_urls.json"
OUTPUT_FILE = "brontapes_products.json"


def get_soup(url: str) -> BeautifulSoup:
    print(f"[GET] {url}")
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")


def parse_properties_table(soup: BeautifulSoup) -> dict:
    props = {
        "Color(s)": None,
        "Adhesive": None,
        "Carrier": None,
        "Total Thickness": None,
    }

    for table in soup.find_all("table"):
        headers_text = " ".join(th.get_text(" ", strip=True) for th in table.find_all("th")).lower()
        if any(word in headers_text for word in ["property", "color", "adhesive", "carrier", "thickness"]):
            for row in table.find_all("tr"):
                cells = row.find_all(["th", "td"])
                if len(cells) >= 2:
                    key = cells[0].get_text(" ", strip=True)
                    value = cells[1].get_text(" ", strip=True)
                    if key in props:
                        props[key] = value
            break

    return props


def parse_description_and_applications(soup: BeautifulSoup):
    description = None
    applications = []

    details_header = None
    for h in soup.find_all(["h2", "h3", "h4", "h5"]):
        if "details" in h.get_text(strip=True).lower():
            details_header = h
            break

    if details_header:
        desc_parts = []
        for sib in details_header.find_next_siblings():
            if sib.name in ["h2", "h3", "h4", "h5"]:
                break
            if sib.name == "p":
                desc_parts.append(sib.get_text(" ", strip=True))
            if sib.name == "ul":
                for li in sib.find_all("li"):
                    txt = li.get_text(" ", strip=True)
                    if txt:
                        applications.append(txt)
        if desc_parts:
            description = " ".join(desc_parts)

    return description, applications


def parse_sizes(soup: BeautifulSoup) -> dict:
    widths, lengths = [], []

    for label in soup.find_all(["label", "span", "p"]):
        text = label.get_text(" ", strip=True).lower()

        if "tape width" in text:
            select = label.find_next("select")
            if select:
                widths.extend(opt.get_text(strip=True) for opt in select.find_all("option") if "select" not in opt.text.lower())

        if "tape length" in text:
            select = label.find_next("select")
            if select:
                lengths.extend(opt.get_text(strip=True) for opt in select.find_all("option") if "select" not in opt.text.lower())

    return {"widths": widths, "lengths": lengths}


def parse_product_page(url: str, category_name: str) -> dict:
    soup = get_soup(url)

    title_tag = soup.find("h1")
    title = title_tag.get_text(" ", strip=True) if title_tag else None

    # SKU
    sku = None
    for el in soup.find_all(string=re.compile(r"SKU:", re.I)):
        m = re.search(r"SKU:\s*(\S+)", el.strip())
        if m:
            sku = m.group(1)
            break

    # Price
    text_all = soup.get_text("\n", strip=True)
    m_price = re.search(r"\$[0-9][0-9.,/]*", text_all)
    price_raw = m_price.group(0) if m_price else None
    price_raw = price_raw.rstrip("/").strip()


    # IMAGE SCRAPER FIXED
    images = []
    VALID_EXT = (".jpg", ".jpeg", ".png", ".webp")

    for img in soup.find_all("img", src=True):
        src = img["src"].strip().split("?")[0]  # remove ?resize params
        s_lower = src.lower()

        # skip garbage
        if any(x in s_lower for x in [
            "logo", "icon", "api/cacheable", "no_image_available"
        ]):
            continue

        # absolute URL
        if src.startswith("//"):
            src = "https:" + src
        elif src.startswith("/"):
            src = urljoin(BASE_URL, src)

        _, ext = os.path.splitext(src.lower())
        if ext not in VALID_EXT:
            continue

        images.append(src)

    # de-duplicate
    images = list(dict.fromkeys(images))

    description, applications = parse_description_and_applications(soup)
    props = parse_properties_table(soup)
    sizes = parse_sizes(soup)

    return {
        "category": category_name,
        "url": url,
        "sku": sku,
        "title": title,
        "price_raw": price_raw,
        "sizes": sizes,
        "color": props.get("Color(s)"),
        "adhesive": props.get("Adhesive"),
        "carrier": props.get("Carrier"),
        "total_thickness": props.get("Total Thickness"),
        "description": description,
        "applications": applications,
        "images": images,   # ← FIXED
    }


def load_existing_output():
    path = Path(OUTPUT_FILE)
    if path.exists():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, list):
                return data
        except:
            return []
    return []


def save_output(data: list):
    Path(OUTPUT_FILE).write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def main():
    url_map = json.loads(Path(INPUT_FILE).read_text(encoding="utf-8"))
    products = load_existing_output()
    processed = {p["url"] for p in products}

    for category_name, urls in url_map.items():
        print(f"\n=== Category: {category_name} ({len(urls)} URLs) ===")

        for url in urls:
            if url in processed:
                print(f"  [SKIP] {url}")
                continue

            try:
                obj = parse_product_page(url, category_name)
                products.append(obj)
                processed.add(url)
                print(f"  [OK] {obj['title']}")
            except Exception as e:
                print(f"  [ERROR] {url}: {e}")

            time.sleep(1)

        save_output(products)

    print("\nDONE.")
    print(f"Total products scraped: {len(products)}")


if __name__ == "__main__":
    main()
