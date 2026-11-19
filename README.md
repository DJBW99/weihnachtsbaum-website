# Weihnachtsbaum-Verkauf Osnabrück-Dodesheide

Website des Weihnachtsbaum-Verkaufs in der ehemaligen Gärtnerei Wallenhorst, Zum Schäferhof 10, Osnabrück-Dodesheide.

**Live:** https://w-wie-weihnachtsbaum.de

## Aufbau

Statische Website aus reinem HTML, CSS und JavaScript – ohne Build-Schritt, ohne externe Bibliotheken oder Schriften.

```
index.html          Startseite (One-Pager)
impressum.html      Impressum
datenschutz.html    Datenschutzerklärung
404.html            Fehlerseite (wird von Cloudflare Pages automatisch genutzt)
css/style.css       Gestaltung (mobile first)
js/main.js          Schneefall, Parallax, Liefer-Auto, Karte nach Klick
assets/img/         Grafiken aus dem Flyer, Favicon
robots.txt          Hinweise für Suchmaschinen
sitemap.xml         Sitemap
_headers            Sicherheits-Header für Cloudflare Pages
```

## Hosting

- **GitHub** speichert nur den Quellcode (Branch `main`).
- **Cloudflare Pages** baut bei jedem Push automatisch neu und liefert die Website aus – inklusive CDN und Schutz.
- **IONOS** ist nur noch Registrar der Domain; die Nameserver zeigen auf Cloudflare.

Änderungen am Hosting müssen auch in der Datenschutzerklärung (Ziffer 3) nachgezogen werden.

## Lokal testen

Im Projektordner einen einfachen Webserver starten und http://localhost:8080 öffnen:

```bash
python -m http.server 8080
```

## Inhalte aktualisieren

- **Neue Saison:** Datum in `index.html` an drei Stellen anpassen (Hero, Kurzinfo, Öffnungszeiten).
- **CSS oder JavaScript geändert:** Versionsnummer (`?v=…`) in allen HTML-Dateien erhöhen, damit Besucher die neue Fassung laden.

## Lizenz

Alle Rechte vorbehalten – siehe [LICENSE](LICENSE).
