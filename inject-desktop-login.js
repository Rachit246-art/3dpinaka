const fs = require('fs');

let htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for(let file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if it's already there to prevent double injection
    if (content.includes('<i class="ph ph-user"></i>') && content.includes('href="login.html"')) {
        // We already injected into the main body or we might want to check for the nav-icons specifically.
        // Wait, the bottom nav has <a href="login.html"...> <i class="ph ph-user"></i> ... 
    }
    
    // We strictly match the start of the nav-icons block:
    const target = '<div class="nav-icons">\n                <i class="ph ph-magnifying-glass"></i>';
    const replacement = '<div class="nav-icons">\n                <i class="ph ph-magnifying-glass"></i>\n                <a href="login.html" style="color:var(--text-dark); text-decoration:none;"><i class="ph ph-user"></i></a>';
    
    if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(file, content);
        console.log('Updated nav-icons in', file);
    }
}
