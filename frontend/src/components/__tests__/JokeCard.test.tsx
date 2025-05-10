import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { JokeCard } from "../JokeCard";

const mockOnRate = jest.fn();
const mockOnEdit = jest.fn();

const sampleJoke = {
  id: "123",
  type: "programming",
  setup: "Why do programmers prefer dark mode?",
  punchline: "Because light attracts bugs!",
  rating: 4.5,
  votes: 10,
};

describe("JokeCard Component", () => {
  beforeEach(() => {
    mockOnRate.mockClear();
    mockOnEdit.mockClear();
  });

  test("renders joke content correctly", () => {
    render(
      <JokeCard
        joke={sampleJoke}
        onRate={mockOnRate}
        onEdit={mockOnEdit}
        darkMode={false}
      />,
    );

    expect(screen.getByText(sampleJoke.setup)).toBeInTheDocument();
    expect(screen.getByText(sampleJoke.punchline)).toBeInTheDocument();
    expect(
      screen.getByText(sampleJoke.type, { exact: false }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(`${sampleJoke.rating}`, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${sampleJoke.votes}`, { exact: false }),
    ).toBeInTheDocument();
  });

  test("calls onRate when rating is clicked", () => {
    render(
      <JokeCard
        joke={sampleJoke}
        onRate={mockOnRate}
        onEdit={mockOnEdit}
        darkMode={false}
      />,
    );

    const ratingButtons = screen.getAllByRole("button", { name: /star/i });

    fireEvent.click(ratingButtons[0]);

    expect(mockOnRate).toHaveBeenCalledWith(sampleJoke.id, expect.any(Number));
  });

  test("calls onEdit when edit button is clicked", () => {
    render(
      <JokeCard
        joke={sampleJoke}
        onRate={mockOnRate}
        onEdit={mockOnEdit}
        darkMode={false}
      />,
    );

    const editButton = screen.getByRole("button", { name: /edit/i });

    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalled();
  });

  test("renders with dark mode styles when darkMode is true", () => {
    const { container, rerender } = render(
      <JokeCard
        joke={sampleJoke}
        onRate={mockOnRate}
        onEdit={mockOnEdit}
        darkMode={false}
      />,
    );

    const lightModeCard = container.firstChild;

    rerender(
      <JokeCard
        joke={sampleJoke}
        onRate={mockOnRate}
        onEdit={mockOnEdit}
        darkMode={true}
      />,
    );

    const darkModeCard = container.firstChild;

    expect(lightModeCard).not.toHaveClass("bg-gray-800");
    expect(darkModeCard).toHaveClass("bg-gray-800");
  });
});
