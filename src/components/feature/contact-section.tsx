import { Mail, MapPin, Phone } from "lucide-react";
import siteData from "@/data/site.json";

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
          Contact & Location
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-8 bg-muted/50 p-8 rounded-2xl border">
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
              <p className="text-muted-foreground mb-8">
                You can contact us for your projects and technological needs.
                Our team will get back to you as soon as possible.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p className="text-muted-foreground">
                    {siteData.contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <a
                    href={`mailto:${siteData.contact.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {siteData.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <a
                    href={`tel:${siteData.contact.phone.replace(/\s+/g, "")}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {siteData.contact.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="h-full min-h-[400px] w-full rounded-2xl overflow-hidden border">
            <iframe
              title="Location Map"
              src={siteData.googleMap}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
