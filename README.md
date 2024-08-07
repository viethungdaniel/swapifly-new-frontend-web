# Swapifly Website

Model: E-commerce (C&C)

Main feature:

- Chat / Chat GPT
- Sale product
- News
- ...

## Framework + Libary

Base framework

- NodeJs (v.16)
- Yarn
- NextJs (v.13)
- ReactJs (v.18)
- Typescript (v.5)

UI

- Material UI (v.5) + tss-reac (support make style for MUI on typescript)

Main libary

- Redux + redux-saga
- next-redux-wrapper => handle store state on ssr (can skip it if you don't understand how to manipulate state between ssr and csr)
- Formik + yup (Form handler)
- Firebase
- @react-oauth/google => handle login media social
- nexti18n (multiple language)
- ...

Realtime

- WebSocket

## Noted

if you see me using cookies to save or read or delete state, that's how I get response from ssr to csr to communicate with each other.

#### For example

you handle wechat login on ssr and want csr to receive notification, i need to save response status on ssr and when down to csr, i check and get them from cookie and show notification and delete immediately

## Website

#### Production

[swapifly.com](https://swapifly.com)

#### Development

[dev-web-v2.swapifly.com](https://dev-web-v2.swapifly.com)

## Install

```bash
yarn install
```

## Run Project

```bash
yarn dev
```

## Build Project

```bash
yarn build
yarn start
```

## Clear Cache

```
yarn cache clean --force
```

## Upgrade Package Version

1. Check the list of packages that need updating

run

```bash
yarn upgrade-interactive
```

or run

```bash
yarn upgrade-interactive --lastest
```

if you want to upgrade the version latest

2. Updates package.json with versions installed from yarn.lock

```bash
syncyarnlock -s -k
```

3. Updates yarn.lock with current version constraint from package.json

```bash
yarn install
```

## Define API params

```
Product:
- rid: number (Category ID)
- uid: number (User ID)
- nid:  number (Product Condition)
- state:  1 | 2 | 3 (Status)
- offline: BooleanNumber  (Trade in person)
- mail (By post & courier)
- region: Region ID
- min: Min price
- max: Max price
- sort: number (Product sort)
- lat: number (Latitude)
- lng: number (Longitude)
- order_by: string (ex: title:asc,time:desc)
- query: Search
- type:
   + all: response => { data: object[], count: number }
   + count: response => { count: number }
   + data: response => { data: object[] }
- brand_id (Brand)
- show: 0 (active) | 1 (nonactive) | "" (all)
- seller.shop: 1 (merchant verified) | 0 (un-verify) // boolean number
- traffic: viewed number of times

User
- e_num: user reviews count
- state: 1 (follow) | 2 (un-follow)

Common
- by_language: get title key by language

User shop
- image: pdf/image/...
- online_shop_verified: admin verify
- existing_br_verified: license verify
- state: 0 (Pending) | 1 (verified) | 2 (rejected)
```

# robots.txt File Config

Type

```typescript
type Robots = {
  rules:
    | {
        userAgent?: string | string[];
        allow?: string | string[];
        disallow?: string | string[];
        crawlDelay?: number;
      }
    | Array<{
        userAgent: string | string[];
        allow?: string | string[];
        disallow?: string | string[];
        crawlDelay?: number;
      }>;
  sitemap?: string | string[];
  host?: string;
};
```

Form JSON

```json
{
  "rules": [{
    "userAgent": "*",
    "allow": "/",
  }]
};
```

# ads/app-ads.txt NEXT_PUBLIC_APP_ADS_CONFIG

Type

```typescript
type Ads = {
  rules:
    | {
        domain: string;
        publisherId: string;
        relationshipType: "DIRECT" | "RESELLER";
        certificationAuthorityId: string;
      }
    | Array<{
        domain: string;
        publisherId: string;
        relationshipType: "DIRECT" | "RESELLER";
        certificationAuthorityId: string;
      }>;
};
```

Form JSON

```json
{
  "rules": [{
    {
      "domain": "google.com",
      "publisherId": "pub-123456789",
      "relationshipType": "DIRECT",
      "certificationAuthorityId": "abcd123456789xyz"
  }]
};
```
