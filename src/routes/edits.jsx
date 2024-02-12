import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts"; // Importing function to update contact data

// Action function to handle form submission
export const action = async ({ request, params }) => {
  const formData = await request.formData(); // Extract form data
  const updates = Object.fromEntries(formData); // Convert form data to object
  await updateContact(params.contactId, updates); // Update contact with new data
  return redirect(`/contacts/${params.contactId}`); // Redirect to contact details page after update
};

// EditContact component for editing contact details
export default function EditContact() {
  const contact = useLoaderData(); // Load contact data from the loader

  const navigate = useNavigate(); // Access navigation function

  return (
    <Form method="post" id="contact-form">
      {/* Inputs for editing contact details */}
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      {/* Buttons for saving changes and canceling */}
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
