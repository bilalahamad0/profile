const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'HeroV2.tsx',
  'BentoGridV2.tsx',
  'NavbarV2.tsx',
].map(f => path.join(__dirname, f));

const replacements = [
  { regex: /\btext-white\b/g, replacement: 'text-zinc-900 dark:text-white' },
  { regex: /\btext-zinc-100\b/g, replacement: 'text-zinc-900 dark:text-zinc-100' },
  { regex: /\btext-zinc-200\b/g, replacement: 'text-zinc-800 dark:text-zinc-200' },
  { regex: /\btext-zinc-300\b/g, replacement: 'text-zinc-700 dark:text-zinc-300' },
  { regex: /\btext-zinc-400\b/g, replacement: 'text-zinc-600 dark:text-zinc-400' },
  // Let's also do backgrounds
  { regex: /\bbg-white\/5\b/g, replacement: 'bg-black/5 dark:bg-white/5' },
  { regex: /\bbg-white\/10\b/g, replacement: 'bg-black/10 dark:bg-white/10' },
  { regex: /\bbg-zinc-800\b/g, replacement: 'bg-zinc-200 dark:bg-zinc-800' },
  { regex: /\bbg-zinc-900\b/g, replacement: 'bg-zinc-100 dark:bg-zinc-900' },
  { regex: /\bbg-\[#0c1017\]\b/g, replacement: 'bg-white dark:bg-[#0c1017]' },
  { regex: /\bbg-\[#121822\]\b/g, replacement: 'bg-zinc-50 dark:bg-[#121822]' },
  // Let's also do borders
  { regex: /\bborder-white\/5\b/g, replacement: 'border-black/5 dark:border-white/5' },
  { regex: /\bborder-white\/10\b/g, replacement: 'border-black/10 dark:border-white/10' },
  { regex: /\bborder-zinc-700\b/g, replacement: 'border-zinc-300 dark:border-zinc-700' },
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Prevent double replacements if already contains 'dark:'
    replacements.forEach(({ regex, replacement }) => {
      // Find all matches
      let matches = content.match(regex);
      if (matches) {
          content = content.replace(regex, (match, offset, string) => {
              // rough check: is there "dark:" right before or around?
              // we can just check if replacement is already in the string.
              // Actually, since we use `dark:xxx`, if we run regex again it might replace the inner `xxx`.
              // A safer regex replacement logic: 
              const prefix = string.substring(Math.max(0, offset - 10), offset);
              if (prefix.includes('dark:')) return match; // skip if already dark:
              return replacement;
          });
      }
    });

    // Save back
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
