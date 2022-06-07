import { render, screen } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import ConfigureMatch from './ConfigureMatch';

let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('Rendered form buttons properly', () => {
  render(<ConfigureMatch rootElement={container} />, container);
  const btnElements = screen.getAllByRole('button');
  btnElements.forEach((element) => {
    expect(['Reset', 'Start Match']).toContain(element.textContent);
  });
});