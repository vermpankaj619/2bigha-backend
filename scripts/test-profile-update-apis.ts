// Test script for the four new profile update APIs
async function testProfileUpdateAPIs() {
    console.log("🧪 Testing Profile Update APIs...")

    // Mock authentication token (replace with actual token in real testing)
    const mockAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMGU4ZjdlYS02MzEyLTRiNDAtOWU0MS02NzNkZWE2ODNjZDEiLCJlbWFpbCI6ImNvZGVwYW5rYWowNEBnbWFpbC5jb20iLCJyb2xlIjoiT1dORVIiLCJzZXNzaW9uSWQiOiJiY2U4NDE4ZC1jOTU5LTQ2NjMtODcyYS0wMmMxNjBlZjNkODYiLCJpYXQiOjE3NTIyOTU2ODAsImV4cCI6MTc1MjM4MjA4MH0.qEWRKu9tfL5lcFHTrE6x9ButMryH9dT2fex7gyipVIk"

    const testQueries = {
        // Test Basic Information Update
        updateBasicInfo: `
     mutation UpdateBasicInfo($input: UpdateBasicInfoInput!) {
  updateBasicInfo(input: $input) {
    id
  }
}
    `,

        // Test Address Information Update
        updateAddressInfo: `
      mutation UpdateAddressInfo($input: UpdateAddressInfoInput!) {
        updateAddressInfo(input: $input) {
          id
        }
      }
    `,

        // Test Online Presence Update
        updateOnlinePresence: `
      mutation UpdateOnlinePresence($input: UpdateOnlinePresenceInput!) {
        updateOnlinePresence(input: $input) {
           id
        }
      }
    `,

        // Test Professional Information Update
        updateProfessionalInfo: `
      mutation UpdateProfessionalInfo($input: UpdateProfessionalInfoInput!) {
        updateProfessionalInfo(input: $input) {
           id
        }
      }
    `,
    }

    const testData = {
        basicInfo: {
            firstName: "Pankaj",
            lastName: "Verma",
            email: "codepankaj04@gmail.com",
            phone: "+91 98765 43210",
            bio: "Experienced real estate professional with over 5 years in the industry. Specializing in residential properties and helping first-time buyers find their dream homes.",
            avatar: "https://example.com/avatar.jpg",
        },

        addressInfo: {
            address: "123 MG Road, Koramangala",
            state: "Karnataka",
            city: "Bengaluru",
            country: "India",
            pincode: "560034",
            location: "Koramangala, Bengaluru",
        },

        onlinePresence: {
            website: "https://pankajverma.realtor",
            socialLinks: {
                linkedin: "https://linkedin.com/in/pankajverma",
                twitter: "https://twitter.com/pankajverma",
                facebook: "https://facebook.com/yourpage",
                instagram: "https://instagram.com/yourhandle",
                youtube: "https://youtube.com/yourchannel",
            },
        },

        professionalInfo: {
            experience: 7, // 6-10 years range
            specializations: ["Residential Sales", "First-Time Buyers", "Apartments"],
            languages: ["English", "Hindi", "Kannada"],
            serviceAreas: ["Koramangala", "BTM Layout", "HSR Layout"],
        },
    }

    try {
        console.log("\n1️⃣ Testing Basic Information Update...")
        console.log("Variables:", JSON.stringify({ input: testData.basicInfo }, null, 2))
        console.log("Query:", testQueries.updateBasicInfo)

        // console.log("\n2️⃣ Testing Address Information Update...")
        // console.log("Variables:", JSON.stringify({ input: testData.addressInfo }, null, 2))
        // console.log("Query:", testQueries.updateAddressInfo)

        // console.log("\n3️⃣ Testing Online Presence Update...")
        // console.log("Variables:", JSON.stringify({ input: testData.onlinePresence }, null, 2))
        // console.log("Query:", testQueries.updateOnlinePresence)

        // console.log("\n4️⃣ Testing Professional Information Update...")
        // console.log("Variables:", JSON.stringify({ input: testData.professionalInfo }, null, 2))
        // console.log("Query:", testQueries.updateProfessionalInfo)

        console.log("\n✅ All test queries prepared successfully!")
        console.log("\n📝 To test these APIs:")
        console.log("1. Start your GraphQL server")
        console.log("2. Use GraphQL Playground or any GraphQL client")
        console.log("3. Set Authorization header: Bearer <your-token>")
        console.log("4. Run each mutation with the provided variables")

        // Example curl commands
        console.log("\n🔧 Example curl command for Basic Info Update:")
        console.log(`
curl -X POST http://localhost:4000/graphql \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${mockAuthToken}" \\
  -d '{
    "query": "${testQueries.updateBasicInfo.replace(/\n/g, "\\n").replace(/"/g, '\\"')}",
    "variables": ${JSON.stringify({ input: testData.basicInfo })}
  }'
    `)
    } catch (error) {
        console.error("❌ Test preparation failed:", error)
    }
}

// Run the test
if (require.main === module) {
    testProfileUpdateAPIs()
}

export { testProfileUpdateAPIs }
