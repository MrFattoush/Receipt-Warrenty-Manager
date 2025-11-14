#!/usr/bin/env node

// IP Address Finder Script
// Run this script to automatically find your computer's IP address

const os = require('os');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            // Skip internal (loopback) addresses
            if (interface.internal) continue;
            
            // Look for IPv4 addresses
            if (interface.family === 'IPv4') {
                // Check if it's a local network IP
                const ip = interface.address;
                if (ip.startsWith('192.168.') || 
                    ip.startsWith('10.') || 
                    ip.startsWith('172.')) {
                    return ip;
                }
            }
        }
    }
    return null;
}

function main() {
    console.log('🔍 Finding your local IP address...\n');
    
    const localIP = getLocalIP();
    
    if (localIP) {
        console.log(`✅ Found your IP: ${localIP}`);
        console.log(`📱 Update your config.ts file with: http://${localIP}:5000`);
        console.log(`\n📋 Copy this line to your config.ts:`);
        console.log(`   return 'http://${localIP}:5000';`);
    } else {
        console.log('❌ Could not find a local network IP address');
        console.log('💡 Make sure you\'re connected to WiFi and try running:');
        console.log('   Windows: ipconfig');
        console.log('   Mac/Linux: ifconfig');
    }
    
    console.log('\n🌐 All network interfaces:');
    const interfaces = os.networkInterfaces();
    for (const [name, addresses] of Object.entries(interfaces)) {
        console.log(`   ${name}:`);
        addresses.forEach(addr => {
            if (addr.family === 'IPv4') {
                console.log(`     ${addr.address} (${addr.internal ? 'internal' : 'external'})`);
            }
        });
    }
}

main();


