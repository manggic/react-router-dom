import {
  Link,
  Outlet,
  useLoaderData,
  Form,
  NavLink,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";

export async function loader({ request }) {

  console.log('loader');
  const url = new URL(request.url);
  const qs = url.searchParams.get("qs");
  const contacts = await getContacts(qs);
  return { contacts, qs };
}

export async function action() {
  const contact = await createContact();
  return { contact };
}

export default function Root() {
  const { contacts = [], qs } = useLoaderData();

  const navigate = useNavigation();
  const submit = useSubmit();

  const searching =
    navigate.location &&
    new URLSearchParams(navigate.location.search).has("qs");

  useEffect(() => {
    document.getElementById("q").value = qs;
  }, [qs]);

  return (
    <>
      <div id="sidebar">
        <h2>{name}</h2>
        <h1>React Router Contacts</h1>
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
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
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
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigate.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}