# Glazier JSBin Card

A card for loading and displaying jsbins in [glazier][].


## Installation (adding to glazier)

1. Clone this repo.
2. In your glazier/cards directory, symlink `cards/jsbin` and
   `cards/jsbin-output` as `glazier-jsbin` and `glazier-jsbin-output`
   respectively.
3. In glazier, `grunt ingestCards`.
4. You can now `add_pane "glazier-jsbin"` to a dashboard.

Note that for the card to function properly, you need to load data of the form
`{ id: <jsbinId> }`.  Probably the right way to do this is to use glazier's
admin data service or equivalent.

## Development (working on this card)

This repository contains two cards: these instructions apply to either of them.

In the root card directory (eg `cards/jsbin`), do the following:

1. Run `npm install` if necessary.
2. Run `grunt autotest`.
3. Navigate to `http://localhost:8000`

This should run all tests located in the `test` directory.

## Debugging

- It sometimes helps to debug Oasis initialization.  You can either
  `requireModule("oasis/logger").enable()` or uncomment the `Logger.enable()`
  line in `conductor.js.html`.

## TODOs
- handle loading state
- error handling (eg no such bin)
- css (ie make less hideous)

### Glazier Integration
- load data initially in a sane way in glazier (eg let repository admins
  configure an initial jsbin to load)
- require output card without adding it to the dashboard (we add it
  ourselves)
- get `container_test` working in glazier environment (it currently depends
  on fullxhr service)


[glazier]: https://github.com/yapplabs/glazier
