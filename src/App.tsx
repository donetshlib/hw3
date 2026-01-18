import React, { useEffect, useMemo, useRef, useState } from "react";

type Book = {
  id: string;
  name: string;
  author: string;
  imgUrl: string;
  genre: string;
  rating: number;
  description: string;
  isRead: boolean;
};

const PLACEHOLDER_IMG =
  "https://via.placeholder.com/90x120.png?text=Book";

export default function BooksApp() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      name: "Clean Code",
      author: "Robert C. Martin",
      imgUrl: PLACEHOLDER_IMG,
      genre: "Programming",
      rating: 4.7,
      description: "How to write clean, maintainable code.",
      isRead: false,
    },
    {
      id: "2",
      name: "The Pragmatic Programmer",
      author: "Andrew Hunt, David Thomas",
      imgUrl: PLACEHOLDER_IMG,
      genre: "Programming",
      rating: 4.6,
      description: "Practical advice for software developers.",
      isRead: true,
    },
  ]);

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const [newName, setNewName] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newRating, setNewRating] = useState<string>("");
  const [newDescription, setNewDescription] = useState("");

  // componentDidMount
  useEffect(() => {
    console.log("BooksApp mounted");
  }, []);

  // componentDidUpdate (log changes)
  const prevRef = useRef({
    books,
    filter,
    selectedBookId,
  });

  useEffect(() => {
    const prev = prevRef.current;

    if (prev.books !== books) console.log("books changed", books);
    if (prev.filter !== filter) console.log("filter changed", filter);
    if (prev.selectedBookId !== selectedBookId)
      console.log("selectedBookId changed", selectedBookId);

    prevRef.current = { books, filter, selectedBookId };
  }, [books, filter, selectedBookId]);

  const filteredBooks = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return books;

    return books.filter((b) => {
      return (
        b.id.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    });
  }, [books, filter]);

  const selectedBook = useMemo(() => {
    if (!selectedBookId) return null;
    return books.find((b) => b.id === selectedBookId) ?? null;
  }, [books, selectedBookId]);

  function addBook() {
    const name = newName.trim();
    const author = newAuthor.trim();
    const genre = newGenre.trim();
    const description = newDescription.trim();

    if (!name || !author || !genre || !description) {
      alert("Заповни всі поля: ім’я, автор, жанр, рейтинг, опис");
      return;
    }

    const ratingNum = Number(newRating);
    if (!Number.isFinite(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      alert("Рейтинг має бути числом від 0 до 5");
      return;
    }

    const newBook: Book = {
      id: crypto.randomUUID(),
      name,
      author,
      imgUrl: PLACEHOLDER_IMG,
      genre,
      rating: ratingNum,
      description,
      isRead: false,
    };

    setBooks((prev) => [newBook, ...prev]);

    setNewName("");
    setNewAuthor("");
    setNewGenre("");
    setNewRating("");
    setNewDescription("");
  }

  function toggleRead(bookId: string) {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isRead: !b.isRead } : b))
    );
  }

  // ----------------------------
  // "Page": Details
  // ----------------------------
  if (selectedBookId && selectedBook) {
    return (
      <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 900, margin: "0 auto" }}>
        <h2>Сторінка книги</h2>

        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <img src={selectedBook.imgUrl} alt="book" width={90} height={120} />
          <div>
            <div><b>Ім’я:</b> {selectedBook.name}</div>
            <div><b>Автор:</b> {selectedBook.author}</div>
            <div><b>Жанр:</b> {selectedBook.genre}</div>
            <div><b>Рейтинг:</b> {selectedBook.rating}</div>
            <div style={{ marginTop: 8 }}><b>Опис:</b> {selectedBook.description}</div>

            <label style={{ display: "block", marginTop: 12 }}>
              <input
                type="checkbox"
                checked={selectedBook.isRead}
                onChange={() => toggleRead(selectedBook.id)}
              />{" "}
              прочитано
            </label>

            <button
              style={{ marginTop: 12 }}
              onClick={() => setSelectedBookId(null)}
            >
              Назад до списку
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------
  // "Page": List
  // ----------------------------
  return (
    <div style={{ fontFamily: "system-ui", padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2>BooksApp</h2>

      <div style={{ marginBottom: 14 }}>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Фільтр за id, name, author"
          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <h3>Додати нову книгу</h3>

        <div style={{ display: "grid", gap: 10 }}>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ім’я" />
          <input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="Автор" />
          <input value={newGenre} onChange={(e) => setNewGenre(e.target.value)} placeholder="Жанр" />
          <input
            value={newRating}
            onChange={(e) => setNewRating(e.target.value)}
            placeholder="Рейтинг (0..5)"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Опис"
            rows={3}
          />
          <button onClick={addBook}>Додати</button>
        </div>
      </div>

      <h3>Список книг</h3>

      <div style={{ display: "grid", gap: 12 }}>
        {filteredBooks.map((b) => (
          <div key={b.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, display: "flex", gap: 12 }}>
            <img src={b.imgUrl} alt="book" width={60} height={80} />
            <div style={{ flex: 1 }}>
              <div><b>{b.name}</b></div>
              <div>{b.author}</div>
              <div>Рейтинг: {b.rating}</div>
              <div>Прочитано: {b.isRead ? "так" : "ні"}</div>
            </div>

            <button onClick={() => setSelectedBookId(b.id)}>Деталі</button>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <div style={{ opacity: 0.7 }}>Нічого не знайдено</div>
        )}
      </div>
    </div>
  );
}
