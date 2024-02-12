import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

// Loader function to fetch contact details based on contactId
const loader = async ({ params }) => {
  const contact = await getContact(params?.contactId); // Fetch contact details
  
  // If contact does not exist, throw 404 error
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return contact; // Return contact details
};

// Action function to handle form submission and update contact favorite status
export async function action({ request, params }) {
  let formData = await request.formData(); // Extract form data
  return updateContact(params.contactId, { // Update contact with new favorite status
    favorite: formData.get("favorite") === "true", // Convert favorite status to boolean
  });
}

// Contact component to display contact details
export default function Contact() {
  const contact = useLoaderData(); // Load contact data from loader

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || null} /> {/* Display contact avatar */}
      </div>

      <div>
        <h1>
          {/* Display contact name */}
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} /> {/* Display favorite button */}
        </h1>

        {/* Display contact Twitter handle */}
        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {/* Display contact notes */}
        {contact.notes && <p>{contact.notes}</p>}

        <div>
          {/* Form to edit contact details */}
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          {/* Form to delete contact */}
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              // Confirm deletion
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Favorite component to handle favorite button
function Favorite({ contact }) {
  // Determine favorite status
  let favorite = contact.favorite;

  const fetcher = useFetcher(); // Access fetcher hook

  // If form data available, update favorite status
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  // Return favorite button with appropriate label and value
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

// Export loader function
export { loader };
