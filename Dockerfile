FROM node:22.14.0

WORKDIR /app 

COPY package*.json ./

RUN npm install 

COPY . . 

ARG VITE_API_URL
ARG VITE_CLERK_PUBLISHABLE_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

RUN npm run build 

RUN npm install -g serve 

EXPOSE 5173 

CMD ["serve", "-s", "dist", "-l", "5173"]


# Backend already ek server hai.
# Tu bas karta hai: CMD ["npm", "start"] => Node khud server start kar deta hai.
# Frontend server nahi hota production me.
# npm run dev => Ye development server hota hai.
# But production me Vite karta kya hai? => It builds static files

# npm run build =>
# Vite karta kya hai?
# Saare React components ko bundle karta hai
# Multiple JS files ko optimize karta hai
# CSS minify karta hai
# Unused code remove karta hai (tree shaking)
# Production optimized version bana deta hai
# Aur output deta hai ek folder me:
# dist/
#    index.html
#    assets/
#       main.abc123.js
#       style.xyz456.css
# 👉 Ye dist folder static files ka final production version hai.
# Isme koi React server nahi hota.
# Isme sirf HTML + JS + CSS hota hai.



# 🧠 Dev mode vs Build mode
# Dev mode (npm run dev) Vite server chal raha hota hai
# Build mode (npm run build)
# Final optimized static files generate
# Production ready
# No dev server

# Ab problem:
# dist sirf files hain.
# Unhe browser tak kaun bheje?
# Koi na koi server chahiye jo bole:
# “Client ne / manga? Yeh lo index.html”
# Isi liye hum install karte hain:
# npm install -g serve
# Aur run karte hain:
# serve -s dist
# Matlab:
# 👉 dist folder ko static server ke through serve karo.


# docker me:
# frontend container
# backend container
# dono ek internal docker network me


# 🧠 API URL ka Real Scene

# 🟢 1️⃣ Normal Local Development (without Docker)
# Backend chal raha hai: http://localhost:8000
# Frontend call karega: http://localhost:8000/api/...

# 🐳 2️⃣ Docker Mode 
# Ab kya ho raha hai? Backend container and Frontend container Dono ek private docker network me
# Docker ke andar: service name = hostname 
# Agar docker-compose me likha:
# services:
#   backend:
#   frontend:
# To frontend backend ko call karega: http://backend:8000 , Not localhost.
# Ye shi tha agar frontend and backend containers ek dusre se 1 network me bat kar rhe hote , but 
# since hamari static files ko browser serve kar rha hai , to wo localhost:8000 pe hi api bhejega and since wo 
# port bind hai to the backend container's port 8000 => Things are good to go 
# so hame localhost:8000 hi use karna chahiye 

# 🚀 3️⃣ Production (Vercel) 
# Backend deployed hai: https://your-backend.vercel.app
# Frontend call karega: https://your-backend.vercel.app/api/...



# .env.development => Ye tab use hoga jab tu karega: npm run dev
# .env.production => Ye use hota hai jab: npm run build
# Docker build time pe Vite .env.production use karta hai (because we run npm run build)
# But docker network me backend ka hostname hota hai: backend
# To docker-compose me build argument pass karte hain.

# Why we use args instead of environment in case of frontend 
# Because: environment: Runtime pe inject karta hai.
# But frontend static files already build ho chuki hoti hain. Static JS me value build ke time hi embed hoti hai. Runtime env se kuch change nahi hoga.
# frontend (Vite) me environment: se kaam nahi chalega. Hume build-time arguments (args) pass karne hote hain.


# 2 Types of Env Handling
# 1️⃣ Build-time env (Frontend)

# Via:

# build.args


# Ye Dockerfile me ARG → ENV → build ke time inject hota hai.

# 2️⃣ Runtime env (Backend)

# Via:

# env_file:


# Ye container start ke time inject hota hai.

# Iska image se koi lena dena nahi.


