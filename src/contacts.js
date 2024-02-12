// Import necessary libraries
import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

// Base64 encoded URL for the default avatar image
const avatarURL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADlCAMAAAAP8WnWAAABlVBMVEX/ ... (truncated)";

// Function to retrieve contacts with optional search query
export async function getContacts(query) {
  // Simulate network delay
  await fakeNetwork(`getContacts:${query}`);
  // Retrieve contacts from local storage
  let contacts = await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  // Filter contacts based on search query if provided
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  // Sort contacts by last name and creation date
  return contacts.sort(sortBy("last", "createdAt"));
}

// Function to create a new contact
export async function createContact() {
  // Simulate network delay
  await fakeNetwork();
  // Generate a random ID for the new contact
  let id = Math.random().toString(36).substring(2, 9);
  // Create a new contact object with default values
  let contact = {
    id,
    createdAt: Date.now(),
    first: "test",
    last: "test",
    avatar: avatarURL,
    twitter: "@test",
    notes: "test user",
  };
  // Retrieve existing contacts
  let contacts = await getContacts();
  // Add the new contact to the beginning of the contacts array
  contacts.unshift(contact);
  // Save the updated contacts array to local storage
  await set(contacts);
  // Return the newly created contact
  return contact;
}

// Function to retrieve a contact by ID
export async function getContact(id) {
  // Simulate network delay
  await fakeNetwork(`contact:${id}`);
  // Retrieve contacts from local storage
  let contacts = await localforage.getItem("contacts");
  // Find the contact with the specified ID
  let contact = contacts.find((contact) => contact.id === id);
  // Return the contact if found, otherwise return null
  return contact ?? null;
}

// Function to update a contact
export async function updateContact(id, updates) {
  // Simulate network delay
  await fakeNetwork();
  // Retrieve contacts from local storage
  let contacts = await localforage.getItem("contacts");
  // Find the contact with the specified ID
  let contact = contacts.find((contact) => contact.id === id);
  // Throw an error if the contact is not found
  if (!contact) throw new Error("No contact found for", id);
  // Update the contact object with the provided updates
  Object.assign(contact, updates);
  // Save the updated contacts array to local storage
  await set(contacts);
  // Return the updated contact
  return contact;
}

// Function to delete a contact by ID
export async function deleteContact(id) {
  // Retrieve contacts from local storage
  let contacts = await localforage.getItem("contacts");
  // Find the index of the contact with the specified ID
  let index = contacts.findIndex((contact) => contact.id === id);
  // Remove the contact from the contacts array if found
  if (index > -1) {
    contacts.splice(index, 1);
    // Save the updated contacts array to local storage
    await set(contacts);
    return true; // Return true indicating successful deletion
  }
  return false; // Return false indicating contact not found
}

// Function to save contacts to local storage
function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// Function to simulate network delay
let fakeCache = {};

/**
 * Simulates a network request with a random delay.
 * @param {string} key - An optional key to identify the request.
 * If provided, the request will be cached to avoid duplicate requests.
 * @returns {Promise<void>} A Promise that resolves after a random delay.
 */
async function fakeNetwork(key) {
  // If no key is provided, clear the cache to reset it
  if (!key) {
    fakeCache = {};
  }

  // If the request has already been cached, return immediately
  if (fakeCache[key]) {
    return;
  }

  // Mark the request as cached to prevent duplicate requests
  fakeCache[key] = true;

  // Return a Promise that resolves after a random delay
  return new Promise((resolve) => {
    // Generate a random delay between 0 and 800 milliseconds
    setTimeout(resolve, Math.random() * 800);
  });
}

