# Component Spec: Header

## Target File
`src/components/Header.tsx`

## Interaction Model
- **Scroll behavior:** Header background changes from transparent to white with shadow when scrolling past threshold (~50px)
- **Hover:** Nav links have color transition on hover (text color changes)
- **Mobile:** Hamburger menu toggle

## DOM Structure
```
<header class="fixed top-0 left-0 w-full z-50 transition-all">
  <div class="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-8">
      <a class="logo">Klakna</a>
      <nav class="flex items-center gap-6">
        <a>Home</a>
        <a>Markets</a>
        <a>Spot</a>
        <a>Contract</a>
        <a>Finance</a>
        <a>ICO</a>
        <a>Beginner Academy</a>
      </nav>
    </div>
    <div class="flex items-center gap-4">
      <button>Login</button>
      <button>Register</button>
    </div>
  </div>
</header>
```

## Exact CSS Values
- **Header height:** 64px (h-16)
- **Max width:** 1200px
- **Background:** transparent -> white on scroll
- **Box shadow on scroll:** 0 1px 4px rgba(0,0,0,0.08)
- **Logo:** font-size ~22px, font-weight 700, color #0a0b0d
- **Nav links:** font-size 14px, color #0a0b0d, transition color 0.2s
- **Login button:** text-only, font-size 14px, color #0a0b0d
- **Register button:** background #3772ff, color white, border-radius 8px, padding 8px 20px, font-size 14px, font-weight 600

## Responsive
- Desktop (>= 1024px): Full nav visible
- Mobile (< 1024px): Hamburger menu, nav hidden behind drawer
