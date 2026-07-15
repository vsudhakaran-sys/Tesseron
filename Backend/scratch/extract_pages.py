import fitz

pdf_path = "c:\\Users\\Hari\\Desktop\\Tango Telematics\\FleetPulse-Tango.pdf"
out_arch = "c:\\Users\\Hari\\Desktop\\Tango Telematics\\public\\architecture.png"
out_flow = "c:\\Users\\Hari\\Desktop\\Tango Telematics\\public\\process_flow.png"

print("Opening PDF...")
doc = fitz.open(pdf_path)

# Page 5 (0-based index 4)
print("Rendering Page 5...")
page5 = doc[4]
pix5 = page5.get_pixmap(dpi=300)
pix5.save(out_arch)
print(f"Saved architecture to {out_arch}")

# Page 7 (0-based index 6)
print("Rendering Page 7...")
page7 = doc[6]
pix7 = page7.get_pixmap(dpi=300)
pix7.save(out_flow)
print(f"Saved process flow to {out_flow}")

doc.close()
print("Done!")
