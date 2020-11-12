# _Maps_ Endpoints

These endpoints deal with all kinds of _maps_-related stuff (who'd have thought, right?). You'll find all endpoints thoroughly documented in the following sections.

The general prefix for _map_-endpoints is: `/api/maps/`

## Index

- [_Maps_ Endpoints](#maps-endpoints)
  - [Index](#index)
  - [`/`](#)
  - [`/:id([0-9a-fA-F]{24})`](#id0-9a-fa-f24)

## `/`

* Supported methods: `GET`
* Response Content-Type: `application/json`

This endpoint can be used to get a list of all available maps and their short descriptions.

A successful response has the following format:

```json
{
    "success": true,
    "code": 200,
    "body": [
    {
        "_id": "5f55fe7ae09c2e2b14fa74c6",
        "name": "Test Map",
        "desc": "A semi-random map to properly test the KainPlan app."
    }
}
```

## `/:id([0-9a-fA-F]{24})`

* Supported methods: `GET`
* Response Content-Type: `application/json`

This URL is used to retrieve a map. The URL consists of the map's _24 hex-character_ id and the response corresponds to a map model.

This is what a successful response looks like:

```json
{
    "success": true,
    "code": 200,
    "body": {
        "_id": "5f55fe7ae09c2e2b14fa74c6",
        "name": "Test Map",
        "desc": "A semi-random map to properly test the KainPlan app.",
        "width": 1920,
        "height": 1080,
        "background": [ ],
        "nodes": [ ]
    }
}
```


