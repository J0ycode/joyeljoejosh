from PIL import Image
import os

input_path = r"C:/Users/joyel/.gemini/antigravity/brain/546c98fc-f58c-45c8-9dcc-de60e41ae33a/uploaded_media_1769754769278.png"
output_path = r"c:\my_pc\projects\portfolio_websites\joyel's_portfolio\favicon.png"

try:
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Change white pixels to transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img = img.resize((64, 64), Image.Resampling.LANCZOS)
    img.save(output_path, "PNG")
    print("Favicon processed and saved successfully.")
except Exception as e:
    print(f"Error processing favicon: {e}")
