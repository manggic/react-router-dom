import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

const avatarURL =
  "data:image/png;base64,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";

export async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact = {
    id,
    createdAt: Date.now(),
    first: "test",
    last: "test",
    avatar: avatarURL,
    twitter: "@test",
    notes: "test user",
  };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id) {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id, updates) {
  await fakeNetwork();
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
