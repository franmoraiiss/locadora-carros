/* eslint-disable testing-library/await-async-query */
import { render, screen } from '@testing-library/react';
import { Home } from ".";

describe("Welcome Text", () => {
  test("should be able to render the title", () => {
    render(<Home />);

    const title = screen.findByText("Bem-vindo ao sistema Localiza");

    expect(title).toBeDefined();    
  });
});

describe("Paragraph Text", () => {
  test("should be able to render the paragraph", () => {
    render(<Home />);

    const text = screen.findByText("Use a barra de sistema navegação");

    expect(text).toBeDefined();    
  });
});

describe("Company Text", () => {
  test("should be able to render the company rights", () => {
    render(<Home />);

    const text = screen.findByText("xicodes - Todos os direitos reservados");

    expect(text).toBeDefined();    
  });
});
