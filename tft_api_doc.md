Here's the updated Markdown with an additional section explaining how to determine the current set and its name.

````markdown
# TFT Data Dragon - Images Guide

## Overview

Teamfight Tactics static assets (champions, traits, items, augments, etc.) are provided by Riot's **Data Dragon**.

Workflow:

1. Get the latest Data Dragon version.
2. Download the corresponding JSON file.
3. Read the `image.full` field.
4. Build the image URL.

---

# Get the latest version

```
https://ddragon.leagueoflegends.com/api/versions.json
```

Use the latest version returned (or the version from the appropriate `realms` file).

Example:

```text
16.13.1
```

---

# Champions

## Metadata

```
https://ddragon.leagueoflegends.com/cdn/{VERSION}/data/en_US/tft-champion.json
```

Example:

```json
{
  "TFT14_Aatrox": {
    "id": "TFT14_Aatrox",
    "name": "Aatrox",
    "image": {
      "full": "TFT14_Aatrox.TFT_Set14.png"
    }
  }
}
```

## Image URL

```
https://ddragon.leagueoflegends.com/cdn/{VERSION}/img/tft-champion/{image.full}
```

Example:

```
https://ddragon.leagueoflegends.com/cdn/16.13.1/img/tft-champion/TFT14_Aatrox.TFT_Set14.png
```

---

# Traits

## Metadata

```
https://ddragon.leagueoflegends.com/cdn/{VERSION}/data/en_US/tft-trait.json
```

Example:

```json
{
  "TFT14_Divinicorp": {
    "id": "TFT14_Divinicorp",
    "name": "Divinicorp",
    "image": {
      "full": "Divinicorp.png"
    }
  }
}
```

## Image URL

```
https://ddragon.leagueoflegends.com/cdn/{VERSION}/img/tft-trait/{image.full}
```

Example:

```
https://ddragon.leagueoflegends.com/cdn/16.13.1/img/tft-trait/Divinicorp.png
```

---

# Determining the Current Set

Data Dragon **does not provide a field indicating which set an asset belongs to**, nor does it expose an endpoint for the current TFT set.

There is **no endpoint** like:

```http
GET /tft/current-set
```

or a response such as:

```json
{
  "currentSet": 15,
  "name": "K.O. Coliseum"
}
```

Instead, Riot states that the only indicator of a set is the asset naming convention.

## Extract the Set Number

Champion and trait IDs include the set prefix.

Examples:

```text
TFT14_Aatrox
TFT14_Divinicorp
TFT15_Yasuo
```

From these IDs you can extract:

```text
TFT14 -> Set 14
TFT15 -> Set 15
```

A simple regex is enough:

```regex
^TFT(\d+)_
```

Example:

```ts
const match = id.match(/^TFT(\d+)_/);
const setNumber = match ? Number(match[1]) : null;
```

---

## Getting the Set Name

Data Dragon **does not provide the human-readable set name**.

For example, there is no metadata like:

```json
{
  "set": 14,
  "name": "Cyber City"
}
```

If your application needs to display:

```text
Set 14
Cyber City
```

you must maintain your own mapping.

Example:

```ts
const TFT_SET_NAMES = {
  13: "Into the Arcane",
  14: "Cyber City",
  15: "K.O. Coliseum"
};
```

Then:

```ts
const setName = TFT_SET_NAMES[setNumber];
```

---

# General Pattern

```
https://ddragon.leagueoflegends.com/cdn/{VERSION}/img/{CATEGORY}/{IMAGE_FILENAME}
```

Categories:

| Asset | Metadata JSON | Image Folder |
|--------|---------------|--------------|
| Champions | `tft-champion.json` | `img/tft-champion/` |
| Traits | `tft-trait.json` | `img/tft-trait/` |
| Items | `tft-item.json` | `img/tft-item/` |
| Augments | `tft-augments.json` | `img/tft-augment/` |
| Arenas | `tft-arena.json` | `img/tft-arena/` |
| Tacticians | `tft-tactician.json` | `img/tft-tactician/` |

---

# Recommendation

Do **not** hardcode the Data Dragon version.

At application startup (or during your build process):

1. Fetch the latest version from `versions.json`.
2. Cache the version.
3. Use that version for both metadata requests and image URLs.
4. Extract the set number from champion/trait IDs.
5. Use your own mapping to convert the set number into a display name.

This approach keeps your application compatible with future TFT patches and sets while working within the limitations of Riot's Data Dragon.
````
