// Test script to create sample contact messages
// This can be used to test the admin panel's contact messages functionality

const testMessages = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    message: "Hello! I'm interested in your steel gate designs for my home. Could you please provide some pricing information?",
    status: "new",
    created_at: new Date().toISOString()
  },
  {
    name: "Sarah Wilson",
    email: "sarah@company.com",
    message: "We are looking for office partition solutions. Do you handle commercial projects? What's your typical lead time?",
    status: "new", 
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    name: "Raj Sharma",
    email: "raj.sharma@gmail.com",
    message: "Hi, I saw your glass roofing work. Can you install a skylight for my kitchen? What materials do you recommend?",
    status: "read",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    name: "Mohammed Ali", 
    email: "m.ali@business.com",
    message: "Excellent work on the project! Very satisfied with the quality and service. Would definitely recommend to others.",
    status: "replied",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  }
];

console.log("Sample Contact Messages:");
console.log(JSON.stringify(testMessages, null, 2));

// To use this in Supabase SQL editor or manually insert:
console.log("\nSQL INSERT statements:");
testMessages.forEach((msg, index) => {
  console.log(`INSERT INTO contact_messages (name, email, message, status, created_at) VALUES ('${msg.name}', '${msg.email}', '${msg.message}', '${msg.status}', '${msg.created_at}');`);
});