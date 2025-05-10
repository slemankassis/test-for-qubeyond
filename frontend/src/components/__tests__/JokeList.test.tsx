import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JokeList } from "../JokeList";
import axios from "axios";

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

const sampleJokes = [
  {
    id: "123",
    type: "programming",
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs!",
    rating: 4.5,
    votes: 10,
  },
  {
    id: "456",
    type: "general",
    setup: "What do you call a fake noodle?",
    punchline: "An impasta!",
    rating: 3.8,
    votes: 15,
  },
];

describe("JokeList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockAxios.create.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: sampleJokes }),
      post: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn(),
      delete: jest.fn(),
    } as any);
  });

  test("renders loading state initially", () => {
    render(<JokeList darkMode={false} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("renders jokes after loading", async () => {
    render(<JokeList darkMode={false} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(screen.getByText(sampleJokes[0].setup)).toBeInTheDocument();
    expect(screen.getByText(sampleJokes[1].setup)).toBeInTheDocument();
  });

  test("filters jokes by type", async () => {
    render(<JokeList darkMode={false} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const filterSelect = screen.getByRole("combobox");

    userEvent.selectOptions(filterSelect, "programming");

    expect(screen.getByText(sampleJokes[0].setup)).toBeInTheDocument();
    expect(screen.queryByText(sampleJokes[1].setup)).not.toBeInTheDocument();
  });

  test("sorts jokes by setup", async () => {
    render(<JokeList darkMode={false} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const sortButtons = screen.getAllByRole("button", { name: /sort/i });

    fireEvent.click(sortButtons[0]);

    const jokeElements = screen.getAllByText(/setup:/i);

    expect(jokeElements.length).toBe(2);
  });

  test("handles search functionality", async () => {
    mockAxios.create.mockReturnValue({
      get: jest.fn().mockImplementation((url) => {
        if (url.includes("search")) {
          return Promise.resolve({
            data: [sampleJokes[0]],
          });
        }
        return Promise.resolve({ data: sampleJokes });
      }),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as any);

    render(<JokeList darkMode={false} />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);

    fireEvent.change(searchInput, { target: { value: "programmer" } });

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(screen.getByText(sampleJokes[0].setup)).toBeInTheDocument();
    expect(screen.queryByText(sampleJokes[1].setup)).not.toBeInTheDocument();
  });

  test("switches between light and dark mode", () => {
    const { container, rerender } = render(<JokeList darkMode={false} />);

    const lightModeContainer = container.firstChild;

    rerender(<JokeList darkMode={true} />);

    const darkModeContainer = container.firstChild;

    expect(lightModeContainer).not.toHaveClass("dark");
    expect(darkModeContainer).toHaveClass("dark");
  });
});
