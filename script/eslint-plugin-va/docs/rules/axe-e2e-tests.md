# axe-e2e-tests

Mocha tests should call `cy.axeCheck();`.

TODO: context about the motivation / problem goes here

## Rule Details

This rule requires calling `cy.axeCheck();` inside each test.

## Examples

Examples of **incorrect** code for this rule:

```js
it('does something', function() {

});
```

Examples of **correct** code for this rule:

```js
it('does something', function() {
    cy.axeCheck();
});
```
