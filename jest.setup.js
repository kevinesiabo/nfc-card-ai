// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useParams() {
    return {
      cardId: 'demo-1',
    }
  },
  usePathname() {
    return '/dashboard'
  },
}))

// Mock window.location if needed in specific tests
// Use delete window.location and reassign in individual test files if required

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock fetch
global.fetch = jest.fn()

// Mock toast
jest.mock('react-hot-toast', () => ({
  default: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}))

// Mock Next.js Request/Response for API route tests
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init.method || 'GET'
      this.headers = new Headers(init.headers || {})
      this._body = init.body
    }
    
    async json() {
      if (!this._body) return {}
      if (typeof this._body === 'string') {
        return JSON.parse(this._body)
      }
      return this._body
    }
    
    text() {
      return Promise.resolve(this._body || '')
    }
  }
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = {}
      if (init instanceof Headers) {
        init.forEach((value, key) => {
          this._headers[key] = value
        })
      } else if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this._headers[key] = value
        })
      }
    }
    
    get(name) {
      return this._headers[name.toLowerCase()] || null
    }
    
    set(name, value) {
      this._headers[name.toLowerCase()] = value
    }
    
    has(name) {
      return name.toLowerCase() in this._headers
    }
    
    forEach(callback) {
      Object.entries(this._headers).forEach(([key, value]) => {
        callback(value, key, this)
      })
    }
  }
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Headers(init.headers || {})
      this.ok = this.status >= 200 && this.status < 300
    }
    
    async json() {
      if (typeof this.body === 'string') {
        return JSON.parse(this.body)
      }
      return this.body || {}
    }
    
    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body || {})
    }
  }
}

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: class NextRequest {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init.method || 'GET'
      this.headers = new Headers(init.headers || {})
      this._body = init.body
    }
    
    async json() {
      if (!this._body) return {}
      if (typeof this._body === 'string') {
        return JSON.parse(this._body)
      }
      return this._body
    }
    
    text() {
      return Promise.resolve(this._body || '')
    }
  },
  NextResponse: {
    json: (data, init = {}) => {
      return new Response(JSON.stringify(data), {
        status: init.status || 200,
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
      })
    },
  },
}))

