// https://stackoverflow.com/a/3627747/304706
function hex(x) {
  return ("0" + parseInt(x).toString(16)).slice(-2);
}

const rgb2hex = (rgb) => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

it("should load the page", () => {
  cy.visit("http://localhost:3000/");
  cy.findAllByText(/Ant Design Example/i).should("have.length", 1);

  cy.get(".ant-layout-header")
    .then(($els) => {
      const win = $els[0].ownerDocument.defaultView
      const headerBackgroundColorRGB = win.getComputedStyle($els[0]).backgroundColor;
      expect(rgb2hex(headerBackgroundColorRGB)).equal("#13bf77");
    });
});