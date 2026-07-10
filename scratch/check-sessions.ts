import prisma from '../lib/prisma'

async function check() {
  const sessions = await prisma.session.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 1
  })
  
  if (sessions.length === 0) {
    console.log('NO SESSIONS FOUND IN DATABASE')
    return
  }
  
  const session = sessions[0]
  const token = session.token
  const cookieVal = `better-auth.session_token=${token}`
  console.log('TESTING SESSION COOKIE:', cookieVal)
  
  // Test case 1: fetch local container port 3000 with host: localhost:4317
  try {
    const url = 'http://localhost:4317/api/auth/get-session'
    const res = await fetch(url, {
      headers: {
        'Cookie': cookieVal
      }
    })
    const json = await res.json()
    console.log('TEST 1 (external port 4317): res.status =', res.status, 'body =', JSON.stringify(json))
  } catch (err: any) {
    console.error('TEST 1 FAILED:', err.message)
  }

  // Test case 2: fetch local container port 3000 with internal loopback and headers
  try {
    const url = 'http://127.0.0.1:3000/api/auth/get-session'
    const res = await fetch(url, {
      headers: {
        'Cookie': cookieVal,
        'Host': 'localhost:4317',
        'X-Forwarded-Host': 'localhost:4317',
        'X-Forwarded-Proto': 'http'
      }
    })
    const text = await res.text()
    console.log('TEST 2 (internal port 3000, host headers): res.status =', res.status, 'body =', text)
  } catch (err: any) {
    console.error('TEST 2 FAILED:', err.message)
  }
}

check()
