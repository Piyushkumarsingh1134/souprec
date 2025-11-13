export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-secondary via-primary to-secondary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">souprec</h3>
            <p className="text-sm opacity-90">Record. Share. Inspire. The podcast platform for everyone.</p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm opacity-75">PRODUCT</h4>
            <ul className="space-y-2 text-sm opacity-90 hover:[&>*]:opacity-100 [&>*]:cursor-pointer [&>*]:transition-opacity">
              <li>Features</li>
              <li>Pricing</li>
              <li>Security</li>
              <li>Roadmap</li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm opacity-75">COMPANY</h4>
            <ul className="space-y-2 text-sm opacity-90 hover:[&>*]:opacity-100 [&>*]:cursor-pointer [&>*]:transition-opacity">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm opacity-75">LEGAL</h4>
            <ul className="space-y-2 text-sm opacity-90 hover:[&>*]:opacity-100 [&>*]:cursor-pointer [&>*]:transition-opacity">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Cookies</li>
              <li>Compliance</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-75">
          <p>&copy; 2025 Souprec. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-100 transition-opacity">
              Twitter
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity">
              Discord
            </a>
            <a href="#" className="hover:opacity-100 transition-opacity">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
