const ColorContrastChecker = require('color-contrast-checker');
const ccc = new ColorContrastChecker();

// Define color pairs from DESIGN.md
const colorTests = [
    // Light mode combinations
    { name: 'Mountain Sage on Cloud White', fg: '#6B8E6F', bg: '#FEFFFE', size: 'normal' },
    { name: 'Stone Gray on Cloud White', fg: '#4A4A4A', bg: '#FEFFFE', size: 'normal' },
    { name: 'Earth Brown on Cloud White', fg: '#8B7355', bg: '#FEFFFE', size: 'normal' },
    { name: 'Valley Shadow on Cloud White', fg: '#9BA5A1', bg: '#FEFFFE', size: 'normal' },
    { name: 'Success Green on Cloud White', fg: '#4F7942', bg: '#FEFFFE', size: 'normal' },
    { name: 'Warning Orange on Cloud White', fg: '#D4A574', bg: '#FEFFFE', size: 'normal' },
    { name: 'Error Red on Cloud White', fg: '#A85A5A', bg: '#FEFFFE', size: 'normal' },
    { name: 'Info Blue on Cloud White', fg: '#6B8CAE', bg: '#FEFFFE', size: 'normal' },
    
    // Dark mode combinations
    { name: 'Dark Stone on Charcoal Base', fg: '#E8E8E8', bg: '#1A1D1B', size: 'normal' },
    { name: 'Dark Mountain Sage on Charcoal Base', fg: '#8FA693', bg: '#1A1D1B', size: 'normal' },
    { name: 'Moonlight on Charcoal Base', fg: '#8B9590', bg: '#1A1D1B', size: 'normal' },
    { name: 'Dark Success on Charcoal Base', fg: '#7BA36C', bg: '#1A1D1B', size: 'normal' },
    { name: 'Dark Warning on Charcoal Base', fg: '#E6C088', bg: '#1A1D1B', size: 'normal' },
    { name: 'Dark Error on Charcoal Base', fg: '#D4847A', bg: '#1A1D1B', size: 'normal' },
    { name: 'Dark Info on Charcoal Base', fg: '#8DB4D8', bg: '#1A1D1B', size: 'normal' },
    
    // Interactive elements
    { name: 'Primary Button (White on Mountain Sage)', fg: '#FEFFFE', bg: '#6B8E6F', size: 'normal' },
    { name: 'Secondary Button (Mountain Sage on White)', fg: '#6B8E6F', bg: '#FEFFFE', size: 'normal' },
    
    // Large text examples
    { name: 'Large Mountain Sage on White', fg: '#6B8E6F', bg: '#FEFFFE', size: 'large' },
    { name: 'Large Dark Mountain Sage on Charcoal', fg: '#8FA693', bg: '#1A1D1B', size: 'large' }
];

console.log('Blue Ridge Bonsai Society - Color Contrast Analysis Report');
console.log('=' .repeat(65));
console.log();

let passCount = 0;
let failCount = 0;
const issues = [];

colorTests.forEach(test => {
    const isLarge = test.size === 'large';
    const passesAA = ccc.isLevelAA(test.fg, test.bg, isLarge);
    const passesAAA = ccc.isLevelAAA(test.fg, test.bg, isLarge);
    
    // Calculate approximate ratio for display
    const ratio = passesAA ? (passesAAA ? 7.0 : 4.5) : 3.0;
    
    const status = passesAA ? '✅ PASS' : '❌ FAIL';
    const level = passesAAA ? 'AAA' : (passesAA ? 'AA' : 'FAIL');
    
    console.log(`${status} ${test.name}`);
    console.log(`     Level: ${level} | Size: ${test.size}`);
    console.log(`     Foreground: ${test.fg} | Background: ${test.bg}`);
    console.log();
    
    if (passesAA) {
        passCount++;
    } else {
        failCount++;
        issues.push({
            name: test.name,
            fg: test.fg,
            bg: test.bg,
            size: test.size,
            required: isLarge ? 3.0 : 4.5
        });
    }
});

console.log('Summary');
console.log('=' .repeat(30));
console.log(`Total Tests: ${colorTests.length}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log();

if (issues.length > 0) {
    console.log('Issues Found:');
    console.log('-' .repeat(40));
    issues.forEach(issue => {
        console.log(`⚠️  ${issue.name}`);
        console.log(`   Required ratio: ${issue.required}:1`);
        console.log(`   Status: Does not meet WCAG AA requirements`);
        console.log(`   Colors: ${issue.fg} on ${issue.bg}`);
        console.log();
    });
} else {
    console.log('🎉 All color combinations pass WCAG AA standards!');
}
