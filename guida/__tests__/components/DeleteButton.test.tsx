// DeleteButton.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteButton from "../../src/app/components/DeleteButton";
import "@testing-library/jest-dom";

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Post deleted" }),
  })
) as jest.Mock;

describe("DeleteButton", () => {
  const postId = 1;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock calls
  });

  it("renders the button and handles click event", async () => {
    render(<DeleteButton postId={postId} />);

    const button = screen.getByRole("button", { name: /delete post/i });
    expect(button).toBeInTheDocument();

    // Click the button
    fireEvent.click(button);

    // Wait for the fetch call to complete
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Check if the fetch was called with the correct URL and options
    expect(fetch).toHaveBeenCalledWith("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });
  });

  it("does not call fetch when postId is not provided", async () => {
    render(<DeleteButton postId={0} />); // You can pass a 0 or an invalid number

    const button = screen.getByRole("button", { name: /delete post/i });
    fireEvent.click(button);

    // Wait for the fetch call to complete
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(0)); // No fetch should be called
  });

  it("handles fetch failure", async () => {
    // Override the fetch mock to simulate a failed response
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(<DeleteButton postId={postId} />);

    const button = screen.getByRole("button", { name: /delete post/i });
    fireEvent.click(button);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    // You can also check the console for error handling if implemented
  });
});
