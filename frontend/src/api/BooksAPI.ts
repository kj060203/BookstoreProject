import { Book } from '../types/Book';

// Define the FetchBooksResponse type
export interface FetchBooksResponse {
  books: any[]; // Replace `any` with the actual book type if available
  totalNumBooks: number;
}

export const fetchBooks = async (
  page: number,
  pageNum: number,
  isSorted: boolean,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  const categoryParams = selectedCategories
    .map((c) => `category=${encodeURIComponent(c)}`)
    .join('&');

  const response = await fetch(
    `https://bookstoreproject-katejeffries.azurewebsites.net/api/Bookstore?pageSize=${page}&pageNum=${pageNum}&isSorted=${isSorted}${
      selectedCategories.length ? `&${categoryParams}` : ''
    }`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  const data = await response.json();
  console.log('API Response:', data); // Debugging output

  if (!data.something) {
    throw new Error('Invalid API response structure');
  }

  return {
    books: data.something, // Use `something` if API does not return `books`
    totalNumBooks: data.totalNumBooks,
  };
};

export const addBook = async (book: Book): Promise<Book> => {
  try {
    const response = await fetch(
      'https://bookstoreproject-katejeffries.azurewebsites.net/api/Bookstore/AddBook',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add book');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding book:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const updateBook = async (
  bookID: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(
      `https://bookstoreproject-katejeffries.azurewebsites.net/api/Bookstore/UpdateBook/${bookID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (title: string): Promise<void> => {
  try {
    const response = await fetch(
      `https://bookstoreproject-katejeffries.azurewebsites.net/api/Bookstore/DeleteBook/${title}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
