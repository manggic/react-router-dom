import {
  Link,
  Outlet,
  useLoaderData,
  Form,
  NavLink,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts"; // Importing functions for handling contacts
import { useEffect } from "react";

// Function to load initial data for the page
export async function loader({ request }) {
  const url = new URL(request.url);
  const qs = url.searchParams.get("qs");
  const contacts = await getContacts(qs); // Fetch contacts based on the query string
  return { contacts, qs }; // Return contacts and query string for use in the component
}

// Function to perform an action (e.g., create a new contact)
export async function action() {
  const contact = await createContact(); // Create a new contact
  return { contact }; // Return the created contact for use in the component
}

// Root component for the application
export default function Root() {
  const { contacts = [], qs } = useLoaderData(); // Retrieve contacts and query string from the loader

  const navigate = useNavigation(); // Access navigation methods
  const submit = useSubmit(); // Access form submission method

  const searching =
    navigate.location &&
    new URLSearchParams(navigate.location.search).has("qs"); // Check if the user is currently searching

  // Set the search input value to the query string when it changes
  useEffect(() => {
    document.getElementById("q").value = qs;
  }, [qs]);

  return (
    <>
      {/* Sidebar */}
      <div id="sidebar">
        {/* Application title */}
        <h2>{name}</h2>
        <h1>React Router Contacts</h1>
        {/* Search form */}
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="qs"
              className={searching ? "loading" : ""}
              defaultValue={qs}
              onChange={(e) => {
                const isFirstSearch = qs == null;
                submit(e.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          {/* Form to create a new contact */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        {/* Navigation */}
        <nav>
          {/* Display contacts if available */}
          {contacts?.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {/* Display contact name or "No Name" if not available */}
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {/* Display a star if the contact is marked as favorite */}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            // Display message if no contacts found
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      {/* Detail section */}
      <div
        id="detail"
        className={navigate.state === "loading" ? "loading" : ""}
      >
        <Outlet /> {/* Render nested routes */}
      </div>
    </>
  );
}
