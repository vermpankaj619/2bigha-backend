import { GraphQLClient } from "graphql-request"

const client = new GraphQLClient("http://localhost:4001/graphql")

async function testPlatformUserAPIs() {
  console.log("🧪 Testing Platform User APIs...")

  try {
    // Test 1: User Signup
    console.log("\n1. Testing User Signup...")
    const signupMutation = `
      mutation SignupUser($input: PlatformUserSignupInput!) {
        signupUser(input: $input) {
          success
          message
          token
          user {
            id
            email
            firstName
            lastName
            role
            isVerified
          }
          requiresEmailVerification
        }
      }
    `

    const signupResult = await client.request(signupMutation, {
      input: {
        email: "vermapankasddsdsdsj61s3@gmail.com",
        password: "SecurePassword123!",
        firstName: "Pankaj",
        lastName: "Verma",
        phone: "+917000379913",
        role: "USER",
        agreeToTerms: true,
      },
    }) as {
      signupUser: {
        success: boolean
        message: string
        token: string
        user: {
          id: string
          email: string
          firstName: string
          lastName: string
          role: string
          isVerified: boolean
        }
        requiresEmailVerification: boolean
      }
    }

    console.log("✅ Signup successful:", signupResult.signupUser)


    // Test 2: User Login
    console.log("\n2. Testing User Login...")
    const loginMutation = `
         mutation LoginUser($input: PlatformUserLoginInput!) {
        loginUser(input: $input) {
          success
          message
          token
          user {
            id
            email
            firstName
            lastName
            lastLoginAt
          }
        }
      }
    `

    const loginResult = await client.request(loginMutation, {
      input: {
        email: "vermapankaj619@gmail.com",
        password: "SecurePassword123!",
        rememberMe: true,
      },
    }) as {
      loginUser: {
        success: boolean
        message: string
        token: string
        user: {
          id: string
          email: string
          firstName: string
          lastName: string
          lastLoginAt: string
        }
      }
    }


    const userToken = loginResult.loginUser.token
    console.log("✅ Login successful:", loginResult.loginUser)


    console.log(userToken)

    // Test 3: Get Current User (Me)
    console.log("\n3. Testing Get Current User...")
    const authenticatedClient = new GraphQLClient("http://localhost:4001/graphql", {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    })

    const meQuery = `
      query Me {
        me {
          id
          email
          firstName
          lastName
          role
          isVerified
          profile {
            phone
            city
            state
          }
        }
      }
    `

    const meResult = await authenticatedClient.request(meQuery) as {
      me: {
        id: string
        email: string
        firstName: string
        lastName: string
        role: string
        isVerified: boolean
        profile: {
          phone: string
          city: string
          state: string
        }
      }
    }
    console.log("✅ Current user:", meResult.me)

    // Test 4: Update Profile
    console.log("\n4. Testing Profile Update...")
    const updateProfileMutation = `
      mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
          id
          firstName
          lastName
          profile {
            bio
            city
            state
            phone
          }
        }
      }
    `

    const updateResult = await authenticatedClient.request(updateProfileMutation, {
      input: {
        bio: "2bigha enthusiast and property investor",
        city: "New York",
        state: "NY",
        website: "https://johndoe.com",
      },
    }) as {
      updateProfile: {
        id: string
        firstName: string
        lastName: string
        profile: {
          bio: string
          city: string
          state: string
          phone: string
        }
      }
    }

    console.log("✅ Profile updated:", updateResult?.updateProfile)

    // Test 5: Search Users
    console.log("\n5. Testing User Search...")


    // Test 6: Phone OTP Request
    console.log("\n6. Testing Phone OTP Request...")
    const phoneOTPMutation = `
      mutation RequestPhoneOTP($input: PhoneLoginInput!) {
        requestPhoneOTP(input: $input) {
          success
          message
          otpSent
          expiresIn
          remainingAttempts
        }
      }
    `

    try {
      const otpResult = await client.request(phoneOTPMutation, {
        input: {
          phone: "+917000379913",
          deviceId: "test-device-123",
        },
      }) as {
        requestPhoneOTP: {
          success: boolean
          message: string
          otpSent: boolean
          expiresIn: number
          remainingAttempts: number
        }
      }

      console.log("✅ Phone OTP requested:", otpResult.requestPhoneOTP)
    } catch (error) {
      console.log("⚠️ Phone OTP test skipped (requires SMS service):", (error as Error).message)
    }

    console.log("\n🎉 All Platform User API tests completed successfully!")
  } catch (error) {
    console.error("❌ Test failed:", error)
  }
}

// Run tests
testPlatformUserAPIs()
