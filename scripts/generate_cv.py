from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, Image as RLImage
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage
import os, io

# ── Türkçe font kaydı ─────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont("Arial",       "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold",  "C:/Windows/Fonts/arialbd.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Italic","C:/Windows/Fonts/ariali.ttf"))
pdfmetrics.registerFontFamily("Arial",
    normal="Arial", bold="Arial-Bold", italic="Arial-Italic")

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT  = os.path.join(BASE, "public", "Cv.pdf")
PHOTO   = os.path.join(BASE, "public", "vesikalık.jpg")

# ── Fotoğrafı kare crop yap ──────────────────────────────────────────────────
def prepare_photo(path, size=130):
    img = PILImage.open(path).convert("RGB")
    w, h = img.size
    side  = min(w, h)
    left  = (w - side) // 2
    top   = (h - side) // 2
    img   = img.crop((left, top, left + side, top + side))
    img   = img.resize((size * 3, size * 3), PILImage.LANCZOS)
    buf   = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    buf.seek(0)
    return buf

# ── Renkler ───────────────────────────────────────────────────────────────────
BLACK = colors.HexColor("#0d0d0d")
RED   = colors.HexColor("#c0392b")
GRAY  = colors.HexColor("#555555")
LGRAY = colors.HexColor("#888888")
LINE  = colors.HexColor("#cccccc")

# ── Stil yardımcısı ───────────────────────────────────────────────────────────
def s(name, **kw):
    base = dict(fontName="Arial", fontSize=10, leading=14,
                textColor=BLACK, spaceAfter=0, spaceBefore=0)
    base.update(kw)
    return ParagraphStyle(name, **base)

S_NAME    = s("name",   fontName="Arial-Bold",  fontSize=22, leading=27, textColor=BLACK)
S_TITLE   = s("title",  fontName="Arial",       fontSize=11, leading=15, textColor=GRAY)
S_CONTACT = s("cont",   fontName="Arial",       fontSize=8.5,leading=13, textColor=GRAY, alignment=TA_CENTER)
S_SEC     = s("sec",    fontName="Arial-Bold",  fontSize=10, leading=14, textColor=RED,  spaceBefore=6, spaceAfter=2)
S_BODY    = s("body",   fontName="Arial",       fontSize=9.5,leading=14, textColor=BLACK)
S_BOLD    = s("bold",   fontName="Arial-Bold",  fontSize=9.5,leading=14, textColor=BLACK)
S_SMALL   = s("small",  fontName="Arial",       fontSize=8.5,leading=13, textColor=LGRAY)
S_BULLET  = s("bul",    fontName="Arial",       fontSize=9.5,leading=14, textColor=BLACK, leftIndent=12)

def hr():
    return HRFlowable(width="100%", thickness=0.4, color=LINE, spaceAfter=5, spaceBefore=1)

def section(title):
    return [Paragraph(title, S_SEC), hr()]

def bullet(text):
    return Paragraph(f"• {text}", S_BULLET)

def gap(h=4):
    return Spacer(1, h)

def row_table(left_content, right_text, col_split="70%"):
    data = [[left_content, Paragraph(right_text, S_SMALL)]]
    t = Table(data, colWidths=[col_split, "30%"])
    t.setStyle(TableStyle([
        ("ALIGN",         (1,0),(1,-1), "RIGHT"),
        ("VALIGN",        (0,0),(-1,-1),"TOP"),
        ("TOPPADDING",    (0,0),(-1,-1), 1),
        ("BOTTOMPADDING", (0,0),(-1,-1), 1),
    ]))
    return t

# ── Document ──────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=1.8*cm, rightMargin=1.8*cm,
    topMargin=1.6*cm,  bottomMargin=1.6*cm,
)
story = []

# ─────────────────────────────────────────────────────────────────────────────
# HEADER: fotoğraf sağda, isim+unvan solda
# ─────────────────────────────────────────────────────────────────────────────
photo_buf = prepare_photo(PHOTO, size=130)
photo_img = RLImage(photo_buf, width=2.8*cm, height=2.8*cm)

header_left = [
    Paragraph("Talha Kaya", S_NAME),
    gap(2),
    Paragraph("Data Scientist &amp; Machine Learning Engineer", S_TITLE),
    gap(6),
    Paragraph(
        "talh4kaya@gmail.com &nbsp;·&nbsp; github.com/talh4kaya<br/>"
        "linkedin.com/in/talha-kaya-aa5255340 &nbsp;·&nbsp; Sakarya, Türkiye",
        S_CONTACT
    ),
]

header_table = Table(
    [[header_left, photo_img]],
    colWidths=["78%", "22%"]
)
header_table.setStyle(TableStyle([
    ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
    ("ALIGN",         (1,0),(1,0),   "RIGHT"),
    ("TOPPADDING",    (0,0),(-1,-1), 0),
    ("BOTTOMPADDING", (0,0),(-1,-1), 0),
    ("LEFTPADDING",   (0,0),(-1,-1), 0),
    ("RIGHTPADDING",  (0,0),(-1,-1), 0),
]))
story.append(header_table)
story.append(gap(10))

# ─────────────────────────────────────────────────────────────────────────────
# ÖZET
# ─────────────────────────────────────────────────────────────────────────────
story += section("ÖZET")
story.append(Paragraph(
    "Problem çözme yeteneği yüksek, tasarım bakış açısına sahip ve iletişimi güçlü bir mühendis adayıyım. "
    "Python ve C++ ile çalışmayı seviyorum. Teorik bilgiyi gerçek dünya problemlerine "
    "(OCR, Nesne Tespiti, Reinforcement Learning, MLOps) uyarlamaya odaklanıyorum. "
    "Teknofest, Data League ve GFAST gibi ulusal yarışmalarda deneyim kazandım.",
    S_BODY
))
story.append(gap(8))

# ─────────────────────────────────────────────────────────────────────────────
# EĞİTİM
# ─────────────────────────────────────────────────────────────────────────────
story += section("EĞİTİM")
story.append(row_table(Paragraph("<b>Bilgisayar Mühendisliği</b>", S_BOLD), "2022 – 2027 (devam ediyor)"))
story.append(Paragraph("Sakarya Üniversitesi", S_BODY))
story.append(Paragraph("1 yıl İngilizce hazırlık + 4 yıl lisans eğitimi", S_SMALL))
story.append(gap(8))

# ─────────────────────────────────────────────────────────────────────────────
# STAJ / DENEYİM
# ─────────────────────────────────────────────────────────────────────────────
story += section("İŞ DENEYİMİ")
story.append(row_table(Paragraph("<b>Makine Öğrenmesi Stajyeri</b>", S_BOLD), "2025"))
story.append(Paragraph("Arvasis Yazılım Danışmanlık", S_BODY))
story.append(gap(3))
story.append(bullet("Görüntü işleme ve nesne tespiti alanlarında çalıştım."))
story.append(bullet("65 farklı dil için kelime seviyesinde dil tespiti yapabilen hibrit OCR modeli geliştirdim."))
story.append(bullet(
    "Standart Tesseract'ın yetersiz kaldığı karmaşık belgelerde YOLOv8 ile metin tespiti uygulayarak "
    "doğruluk oranını %40'tan %85'in üzerine çıkardım."
))
story.append(bullet("Görüntü ön işleme: gürültü temizleme, binarization, perspektif düzeltme (OpenCV)."))
story.append(gap(8))

# ─────────────────────────────────────────────────────────────────────────────
# PROJELER
# ─────────────────────────────────────────────────────────────────────────────
story += section("PROJELER")

projects = [
    {
        "name": "DSiyasi – Multi-Agent Political Simulation",
        "tech": "Python · FastAPI · LLM · Multi-Agent",
        "bullets": [
            "Stanford 'Generative Agents' makalesinden ilham alarak LLM tabanlı çoklu ajan siyasi simülasyon motoru geliştirdim.",
            "Her ajan kendine özgü memory ve persona şablonuna sahip; FastAPI üzerinden orkestre edilen ajanlar birbirlerinin çıktılarını okuyup tepki üretiyor.",
            "Reflection mekanizması ile ajanlar geçmiş konuşmalardan ders çıkararak görüşlerini dinamik olarak güncelleyebiliyor.",
            "OpenAI API'sine bağımlı kalmamak için yerel küçük modellerle çalışarak maliyetsiz ve sınırsız deney ortamı sağlandı.",
        ]
    },
    {
        "name": "Mangala AI – AlphaZero & Transformer",
        "tech": "PyTorch · AlphaZero · Transformer · MCTS · Self-Play · RL",
        "bullets": [
            "Türk strateji oyunu Mangala için AlphaZero algoritması sıfırdan uygulandı.",
            "Tahta durumunu dizi (sequence) olarak alan Transformer Encoder mimarisi tasarlandı; Self-Attention ile kuyular arası etkileşimler modellendi.",
            "MCTS ile binlerce gelecek hamle simüle edilerek en yüksek kazanma ihtimalli yol seçildi.",
            "Self-play ile eğitilen AlphaZero modeli, milyonlarca adım eğitilmiş PPO ajanını 32–16 skorla yendi.",
        ]
    },
    {
        "name": "Repo-Chat – Privacy-First Local RAG",
        "tech": "LangChain · Ollama · ChromaDB · Llama-3 · React",
        "bullets": [
            "İnternet bağlantısı olmadan yerel makinedeki GitHub repolarıyla konuşmayı sağlayan RAG tabanlı asistan geliştirdim.",
            "Kod parçaları RecursiveCharacterTextSplitter ile semantik bütünlüğü koruyarak chunk'lara bölündü.",
            "ChromaDB'de saklanan vektörler üzerinden anlamsal arama ile ilgili kod bloğu bulunup Llama-3'e bağlam olarak verildi.",
            "Her şey localhost'ta çalışıyor — kodlar asla buluta gitmiyor.",
        ]
    },
    {
        "name": "Guardian-Flow – MLOps & Data Drift",
        "tech": "Docker · Evidently AI · FastAPI · Grafana",
        "bullets": [
            "Yapay zeka modellerinin üretim ortamındaki performans ve veri kaymasını (data drift) canlı izleyen modüler MLOps aracı geliştirdim.",
            "Evidently AI ile eğitim verisi ve canlı veriyi istatistiksel olarak karşılaştırıp (KL divergence) alarm üretildi.",
            "Sistem Docker ile paketlenerek herhangi bir bulut sunucusunda tek komutla ayağa kaldırılabilir hale getirildi.",
        ]
    },
    {
        "name": "Multilingual OCR Engine",
        "tech": "YOLOv8 · OpenCV · CNN · NLP · Python",
        "bullets": [
            "65 dildeki belgeleri analiz eden hibrit görüntü işleme ve dil tespit sistemi (Arvasis staj projesi).",
            "CNN + NLP hibrit yapısıyla dil tespiti; YOLOv8 ile metin bölgeleri nesne olarak tespit edildi.",
            "Dile özel fine-tune OCR motorları dinamik olarak tetiklendi.",
        ]
    },
]

for proj in projects:
    story.append(Paragraph(f"<b>{proj['name']}</b>", S_BOLD))
    story.append(Paragraph(proj["tech"], S_SMALL))
    story.append(gap(2))
    for b in proj["bullets"]:
        story.append(bullet(b))
    story.append(gap(6))

# ─────────────────────────────────────────────────────────────────────────────
# YARIŞMA & BAŞARILAR
# ─────────────────────────────────────────────────────────────────────────────
story += section("YARIŞMA & BAŞARILAR")

competitions = [
    ("Teknofest – Sağlıkta Yapay Zeka (Mutasyon Tahmini)", "İlk eleme etabını geçti"),
    ("Üniversiteler Arası Data League",                     "2. Yer"),
    ("GFAST",                                            "Final etabına katıldı"),
]

for name, result in competitions:
    story.append(row_table(Paragraph(f"<b>{name}</b>", S_BOLD), result))
story.append(gap(8))

# ─────────────────────────────────────────────────────────────────────────────
# TEKNİK BECERİLER
# ─────────────────────────────────────────────────────────────────────────────
story += section("TEKNİK BECERİLER")

skills = [
    ("Programlama Dilleri",      "Python · C++ · SQL · TypeScript · React"),
    ("Kütüphane & Çerçeveler",   "PyTorch · TensorFlow · Scikit-learn · Pandas · NumPy · OpenCV · LangChain"),
    ("Uzmanlık Alanları",        "Makine Öğrenmesi · Görüntü İşleme · Reinforcement Learning · MLOps · RAG · Nesne Tespiti"),
    ("Araçlar",                  "Git/GitHub · Docker · FastAPI · ChromaDB · Evidently AI · Grafana · Ollama"),
    ("Yapay Zeka",               "LLM Entegrasyonu · Multi-Agent Sistemler · Prompt Engineering · Self-Play RL"),
]

for cat, val in skills:
    t = Table(
        [[Paragraph(f"<b>{cat}</b>", S_BOLD), Paragraph(val, S_BODY)]],
        colWidths=["35%", "65%"]
    )
    t.setStyle(TableStyle([
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ("TOPPADDING",    (0,0),(-1,-1), 2),
        ("BOTTOMPADDING", (0,0),(-1,-1), 2),
        ("LEFTPADDING",   (0,0),(-1,-1), 0),
    ]))
    story.append(t)
story.append(gap(8))

# ─────────────────────────────────────────────────────────────────────────────
# EK BİLGİLER
# ─────────────────────────────────────────────────────────────────────────────
story += section("EK BİLGİLER")
story.append(Paragraph(
    "<b>Dil:</b> Türkçe (Ana Dil) &nbsp;·&nbsp; İngilizce (B2 – Hazırlık Eğitimi)",
    S_BODY
))
story.append(gap(4))
story.append(Paragraph(
    "<b>İlgi Alanları:</b> Akademik AI makaleleri okuma, açık kaynak projelere katkı, "
    "strateji oyunları ve oyun teorisi, bilgisayar mühendisliği topluluk etkinlikleri.",
    S_BODY
))

# ── Oluştur ───────────────────────────────────────────────────────────────────
doc.build(story)
print(f"CV olusturuldu: {os.path.abspath(OUTPUT)}")
