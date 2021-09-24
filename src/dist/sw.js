self.addEventListener('install', (evt)=>{
    console.log("Service worker installed")
})
self.addEventListener("activate",(evt)=>{
    console.log("Service worker activated")
})

self.addEventListener('fetch',() => console.log("fetch"));