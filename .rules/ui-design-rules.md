# Senior UI Developer Design Rules & Guidelines

## Core Design Philosophy
- **Consistent Visual Language**: Maintain unified design patterns across all components
- **User-Centric Approach**: Prioritize user experience and accessibility
- **Performance Optimized**: Design with mobile performance in mind
- **Scalable Architecture**: Build reusable, modular UI components

## Color System & Theme

### Primary Color Palette
```javascript
// Brand Colors - Main identity
brand: {
  DEFAULT: '#1CB0F6',  // Primary blue
  50: '#E8F7FE',       // Lightest tint for backgrounds
  100: '#D4F0FD',      // Light backgrounds
  200: '#ACE3FB',      // Subtle elements
  300: '#84D5F9',      // Secondary elements
  400: '#5CC8F8',      // Interactive states
  500: '#1CB0F6',      // Primary actions
  600: '#0991D3',      // Hover states
  700: '#076C9C',      // Active states
  800: '#054866',      // Text on light backgrounds
  900: '#02232F'       // Dark text/headers
}

// Accent Colors - Secondary actions & highlights
cardinal: '#FF4B4B'   // Error states, urgent actions
fox: '#FF9600'        // Warning states, notifications
beetle: '#CE82FF'     // Special features, premium content
humpback: '#2B70C9'   // Information, secondary actions
green: '#58CC02'      // Success states, completion
```

### Color Usage Rules
1. **Primary Actions**: Use `brand-500` for main CTAs
2. **Success States**: Use `green-500` for confirmations
3. **Error States**: Use `cardinal-500` for errors
4. **Warning States**: Use `fox-500` for alerts
5. **Information**: Use `humpback-500` for info messages
6. **Background Tints**: Use 50-200 range for subtle backgrounds
7. **Text Hierarchy**: Use 700-900 range for text contrast

## Typography System

### Font Weights & Hierarchy
```javascript
// Heading Hierarchy
h1: 'text-2xl font-bold'           // Page titles
h2: 'text-xl font-semibold'        // Section headers  
h3: 'text-lg font-semibold'        // Subsection headers
h4: 'text-base font-semibold'      // Component titles

// Body Text
body-large: 'text-base font-normal'     // Primary content
body-regular: 'text-sm font-normal'     // Secondary content
body-small: 'text-xs font-normal'       // Helper text
caption: 'text-[10px] font-normal'      // Labels, metadata

// Interactive Text
button-primary: 'font-bold'             // Primary buttons
button-secondary: 'font-semibold'       // Secondary buttons
link: 'font-medium'                     // Links and clickable text
```

### Text Color Guidelines
```javascript
// Text Colors (use with gray or brand scales)
primary-text: 'text-gray-800'          // Main content
secondary-text: 'text-gray-600'        // Supporting content  
disabled-text: 'text-gray-400'         // Disabled states
inverse-text: 'text-white'             // Text on dark backgrounds
brand-text: 'text-brand-700'           // Brand-colored text
error-text: 'text-cardinal-500'        // Error messages
success-text: 'text-green-700'         // Success messages
```

## Spacing & Layout System

### 8-Point Grid System
All spacing should follow 8px increments for consistency:
```javascript
// Spacing Scale (use Tailwind classes)
xs: 'p-1'    // 4px - Minimal spacing
sm: 'p-2'    // 8px - Tight spacing  
md: 'p-4'    // 16px - Default spacing
lg: 'p-6'    // 24px - Comfortable spacing
xl: 'p-8'    // 32px - Generous spacing
2xl: 'p-12'  // 48px - Section spacing
3xl: 'p-16'  // 64px - Page-level spacing
```

### Layout Patterns
```javascript
// Container Patterns
page-container: 'p-4'              // Standard page padding
section-spacing: 'mb-6'            // Between major sections
component-spacing: 'mb-4'          // Between components
element-spacing: 'mb-2'            // Between related elements

// Card Patterns  
card-padding: 'p-4'                // Internal card spacing
card-spacing: 'mb-4'               // Between cards
card-border-radius: 'rounded-xl'   // Standard card corners
```

## Component Design Patterns

### Button Hierarchy & Styles
```javascript
// Primary Button (Main Actions)
className="bg-brand-500 text-white font-bold py-3 px-6 rounded-xl 
           border-2 border-brand-600 border-b-4 border-r-4
           transform transition-all duration-100 active:translate-y-1 
           active:border-b-2 active:border-r-2"

// Secondary Button (Supporting Actions)  
className="bg-white text-brand-600 font-semibold py-3 px-6 rounded-xl
           border-2 border-brand-500 border-b-4 border-r-4
           transform transition-all duration-100 active:translate-y-1
           active:border-b-2 active:border-r-2"

// Destructive Button (Delete/Remove Actions)
className="bg-cardinal-500 text-white font-bold py-3 px-6 rounded-xl
           border-2 border-cardinal-600 border-b-4 border-r-4  
           transform transition-all duration-100 active:translate-y-1
           active:border-b-2 active:border-r-2"
```

### Card Design System
```javascript
// Standard Card
className="bg-white rounded-xl p-4 shadow-lg border border-gray-200"

// Elevated Card (Interactive)
className="bg-white rounded-xl p-4 shadow-lg border border-gray-200
           transform transition-transform duration-200 active:scale-95"

// Branded Card (Course/Product Cards)
className="rounded-xl p-4 border-2 border-b-6 border-r-6
           transform transition-all duration-100 active:translate-y-1
           active:border-b-3 active:border-r-3"
```

### Input Field Standards
```javascript
// Text Input
className="bg-white border-2 border-gray-300 rounded-xl px-4 py-3
           focus:border-brand-500 focus:ring-2 focus:ring-brand-200
           placeholder:text-gray-400"

// Error State Input
className="bg-white border-2 border-cardinal-500 rounded-xl px-4 py-3
           focus:border-cardinal-600 focus:ring-2 focus:ring-cardinal-200
           placeholder:text-gray-400"

// Success State Input  
className="bg-white border-2 border-green-500 rounded-xl px-4 py-3
           focus:border-green-600 focus:ring-2 focus:ring-green-200
           placeholder:text-gray-400"
```

## Animation & Interaction Guidelines

### Standard Animations
```javascript
// Button Press Animation
transform: [{ translateY: 0 }] → [{ translateY: 2-4 }]
duration: 100ms

// Card Hover/Press Animation  
transform: [{ scale: 1 }] → [{ scale: 0.95 }]
duration: 200ms

// Fade Animations
opacity: 1 → 0.7 → 1
duration: 100ms each step

// Scale Pulse (Attention)
transform: [{ scale: 1 }] → [{ scale: 1.1 }] → [{ scale: 1 }]
duration: 1000ms each step, loop
```

### Touch Feedback Rules
1. **Always provide visual feedback** for interactive elements
2. **Use activeOpacity={0.8}** for subtle press feedback
3. **Use transform animations** for more pronounced feedback
4. **Keep animation duration under 200ms** for responsiveness
5. **Use spring animations** for natural feeling interactions

## Shadow & Elevation System

### Shadow Hierarchy
```javascript
// Elevation Levels
subtle: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2
}

medium: {
  shadowColor: '#000', 
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 4
}

high: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.2,
  shadowRadius: 12,
  elevation: 8
}
```

### When to Use Each Level
- **Subtle**: Form inputs, inactive cards
- **Medium**: Active cards, buttons, modals
- **High**: Floating action buttons, prominent cards

## Accessibility Guidelines

### Color Accessibility
1. **Maintain WCAG AA contrast ratios** (4.5:1 for normal text)
2. **Never rely on color alone** to convey information
3. **Provide alternative indicators** (icons, text, patterns)
4. **Test with colorblind simulation tools**

### Touch Accessibility  
1. **Minimum touch target: 44x44px** for all interactive elements
2. **Provide adequate spacing** between touch targets (8px minimum)
3. **Use pressRetentionOffset** for better touch accuracy
4. **Include accessibility labels** for screen readers

### Text Accessibility
1. **Use semantic heading hierarchy** (h1 → h2 → h3)
2. **Provide sufficient color contrast** for all text
3. **Use readable font sizes** (minimum 14px for body text)
4. **Support dynamic text sizing** where possible

## Component-Specific Rules

### Course/Product Cards
- Use branded background colors from the color palette
- Apply 3D border effect with darker shade for depth
- Include smooth press animations with transform feedback
- Maintain consistent internal spacing (16px padding)
- Use white text on colored backgrounds for contrast

### Form Components
- Group related inputs with consistent spacing (16px between)
- Use clear visual hierarchy for labels and helper text
- Provide immediate validation feedback with color and icons
- Maintain focus states with brand-colored borders

### Navigation Elements
- Use consistent iconography and sizing across all nav items
- Provide clear active/inactive states with color and typography
- Maintain touch-friendly sizing (minimum 44px height)
- Use subtle animations for state changes

## Performance Considerations

### Image Optimization
1. **Use appropriate image formats** (WebP when supported)
2. **Implement lazy loading** for off-screen images
3. **Provide placeholder states** during image loading
4. **Use caching strategies** for frequently accessed images

### Animation Performance
1. **Use native driver** for transform and opacity animations
2. **Avoid animating layout properties** (width, height, margin)
3. **Limit concurrent animations** to maintain 60fps
4. **Use InteractionManager** for complex animations

### Memory Management
1. **Clean up event listeners** in useEffect cleanup functions
2. **Optimize re-renders** with useMemo and useCallback
3. **Use FlatList** for large scrollable lists
4. **Implement proper loading states** to prevent UI blocking

## Code Quality Standards

### Component Structure
```javascript
// 1. Imports (React, libraries, local components)
// 2. TypeScript interfaces/types
// 3. Constants and static data
// 4. Main component function
// 5. Styled components or StyleSheet (if using)
// 6. Export statement
```

### Naming Conventions
- **Components**: PascalCase (e.g., `CourseCard`, `ProfileHeader`)
- **Props interfaces**: ComponentNameProps (e.g., `CourseCardProps`)
- **Hooks**: useCustomHookName (e.g., `useAnimation`, `useApi`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`)

### Best Practices
1. **Extract reusable logic** into custom hooks
2. **Create compound components** for complex UI patterns
3. **Use TypeScript interfaces** for all props and data structures
4. **Implement error boundaries** for graceful error handling
5. **Write unit tests** for critical component logic

## Testing Guidelines

### Visual Testing
1. **Test on multiple screen sizes** (small, medium, large phones)
2. **Verify touch interactions** work consistently across devices
3. **Test with different text sizes** for accessibility
4. **Validate color contrast** in different lighting conditions

### Functional Testing
1. **Test all user interaction flows** end-to-end
2. **Verify error states** display correctly
3. **Test loading states** and skeleton screens
4. **Validate form submission** and validation logic

## Implementation Checklist

Before marking any UI component as complete, ensure:

- [ ] Follows the established color system
- [ ] Uses proper typography hierarchy
- [ ] Implements 8-point grid spacing
- [ ] Includes appropriate touch feedback
- [ ] Meets accessibility standards
- [ ] Has proper error and loading states
- [ ] Uses consistent naming conventions
- [ ] Includes TypeScript definitions
- [ ] Optimized for performance
- [ ] Tested across different screen sizes

---

*These guidelines ensure consistent, accessible, and performant UI across the entire application. Review and update regularly as the design system evolves.*