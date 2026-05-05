const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'HeroV2.tsx',
  'BentoGridV2.tsx',
  'NavbarV2.tsx',
].map(f => path.join(__dirname, f));

const colorReplacements = [
  { regex: /\btext-amber-200\b/g, replacement: 'text-amber-700 dark:text-amber-200' },
  { regex: /\btext-amber-400\b/g, replacement: 'text-amber-600 dark:text-amber-400' },
  
  { regex: /\btext-emerald-300\b/g, replacement: 'text-emerald-700 dark:text-emerald-300' },
  { regex: /\btext-emerald-400\b/g, replacement: 'text-emerald-600 dark:text-emerald-400' },
  { regex: /\border-emerald-500\/10\b/g, replacement: 'border-emerald-500/30 dark:border-emerald-500/10' },
  { regex: /\bbg-emerald-500\/5\b/g, replacement: 'bg-emerald-500/10 dark:bg-emerald-500/5' },
  
  { regex: /\btext-blue-300\b/g, replacement: 'text-blue-700 dark:text-blue-300' },
  { regex: /\btext-blue-400\b/g, replacement: 'text-blue-600 dark:text-blue-400' },
  
  { regex: /\btext-indigo-400\b/g, replacement: 'text-indigo-600 dark:text-indigo-400' },
  
  { regex: /\btext-pink-400\b/g, replacement: 'text-pink-600 dark:text-pink-400' },
  
  { regex: /\btext-cyan-400\b/g, replacement: 'text-cyan-600 dark:text-cyan-400' },
  
  { regex: /\btext-purple-400\b/g, replacement: 'text-purple-600 dark:text-purple-400' },
  
  // Also adjust SVG icons if they use `text-` classes that we just modified, which usually works if they use currentColor.
  // Wait, fill-amber-400 needs fixing too.
  { regex: /\bfill-amber-400\b/g, replacement: 'fill-amber-500 dark:fill-amber-400' },
  { regex: /\bbg-emerald-400\b/g, replacement: 'bg-emerald-500 dark:bg-emerald-400' },
  
  // We missed text-zinc-100 to text-zinc-900 in BentoGrid
  { regex: /\btext-zinc-100\b/g, replacement: 'text-zinc-900 dark:text-zinc-100' },
  { regex: /\btext-zinc-200\b/g, replacement: 'text-zinc-800 dark:text-zinc-200' },
  { regex: /\btext-zinc-300\b/g, replacement: 'text-zinc-700 dark:text-zinc-300' },
  { regex: /\btext-zinc-400\b/g, replacement: 'text-zinc-600 dark:text-zinc-400' },
  { regex: /\btext-zinc-500\b/g, replacement: 'text-zinc-500 dark:text-zinc-500' }, // maybe just keep as is
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    colorReplacements.forEach(({ regex, replacement }) => {
      let matches = content.match(regex);
      if (matches) {
          content = content.replace(regex, (match, offset, string) => {
              const prefix = string.substring(Math.max(0, offset - 15), offset);
              // avoid double replacements
              if (prefix.includes('dark:')) return match;
              return replacement;
          });
      }
    });

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
