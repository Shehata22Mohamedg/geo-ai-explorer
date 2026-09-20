"""
transcript.py — AI Mineral Exploration Workshop
Complete instructor transcript (Egyptian Arabic) for all 76 live slides
plus the 49 reference-library slides (Module 09, R01–R11).

BiDi fix: every Arabic paragraph is marked RTL at the paragraph level
(<w:bidi/>) and at the run level (<w:rtl/>). Every English phrase inside
Arabic text is wrapped in LRI ... PDI isolates so the Unicode BiDi
Algorithm cannot reorder it.
"""

from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

# ═════════════════════════════════════════════════════════════════════════════
# BiDi UTILITIES
# ═════════════════════════════════════════════════════════════════════════════
LRI = "\u2066"   # Left-to-Right Isolate
RLI = "\u2067"   # Right-to-Left Isolate
FSI = "\u2068"   # First-Strong Isolate
PDI = "\u2069"   # Pop Directional Isolate
LRM = "\u200E"   # Left-to-Right Mark
RLM = "\u200F"   # Right-to-Left Mark

# Matches LTR spans: starts and ends with alphanumeric, may contain
# neutral characters (spaces, punctuation, arrows) in between.
_LATIN_SPAN = re.compile(
    r"[A-Za-z0-9]+"
    r"(?:[\s\-_/.,:;%+()\[\]&→←↑↓>'\"~!?=]+[A-Za-z0-9]+)*"
    r"[%°]?"
)

_ARABIC_STRONG = re.compile(
    r"[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]"
)
_LATIN_STRONG = re.compile(r"[A-Za-z]")

def isolate(text: str) -> str:
    """Wrap each LTR span with LRI ... PDI."""
    return _LATIN_SPAN.sub(lambda m: LRI + m.group(0) + PDI, text)

def detect_rtl(text: str) -> bool:
    """Return True if the first strong directional character is Arabic."""
    for ch in text:
        if _ARABIC_STRONG.match(ch):
            return True
        if _LATIN_STRONG.match(ch):
            return False
    return False  # default LTR

def force_rtl_paragraph(paragraph):
    """Set <w:bidi/> on a paragraph so Word treats it as RTL base."""
    pPr = paragraph._p.get_or_add_pPr()
    if pPr.find(qn("w:bidi")) is None:
        bidi = OxmlElement("w:bidi")
        # Insert near the front (after pStyle if it exists)
        pStyle = pPr.find(qn("w:pStyle"))
        if pStyle is not None:
            pStyle.addnext(bidi)
        else:
            pPr.insert(0, bidi)

def force_rtl_run(run):
    """Set <w:rtl/> on a run so Word treats the run text as RTL."""
    rPr = run._element.get_or_add_rPr()
    if rPr.find(qn("w:rtl")) is None:
        rPr.append(OxmlElement("w:rtl"))

def add_bidi_paragraph(doc, text, style=None, bold=False, italic=False,
                       size=None, align=None, auto_direction=True):
    """Add a paragraph with automatic RTL/LTR handling."""
    p = doc.add_paragraph(style=style)
    if align is not None:
        p.alignment = align
    rtl = detect_rtl(text) if auto_direction else False
    if rtl:
        force_rtl_paragraph(p)
    safe = isolate(text) if rtl else text
    run = p.add_run(safe)
    run.bold = bold
    run.italic = italic
    if rtl:
        force_rtl_run(run)
    if size is not None:
        run.font.size = size
    return p

def add_bidi_heading(doc, text, level=1, auto_direction=True):
    """Add a heading with the same BiDi handling."""
    h = doc.add_heading(level=level)
    rtl = detect_rtl(text) if auto_direction else False
    if rtl:
        force_rtl_paragraph(h)
    safe = isolate(text) if rtl else text
    run = h.add_run(safe)
    if rtl:
        force_rtl_run(run)
    return h

# ═════════════════════════════════════════════════════════════════════════════
# MODULE RANGES
# ═════════════════════════════════════════════════════════════════════════════
MODULE_RANGES = {
    "Module 00 — Orientation":                            (1, 5),
    "Module 01 — Why AI, Why Now":                        (6, 14),
    "Module 02 — The Exploration Data Universe":          (15, 22),
    "Module 03 — From Field to Feature":                  (23, 29),
    "Module 04 — How Machine Learning Actually Works":    (30, 41),
    "Module 05 — AI Across the Exploration Value Chain":  (42, 52),
    "Module 06 — Case Study — Project Solstice":          (53, 60),
    "Module 07 — Where AI Fails":                         (61, 67),
    "Module 08 — Tools & The Future Geologist":           (68, 76),
}

SLIDE_TITLES = {
    1:  "A Geologist's Guide to AI & Machine Learning in Mineral Exploration",
    2:  "Shehata Mekawy — About the Instructor",
    3:  "The arc of the day",
    4:  "Calibrating the room",
    5:  "You have been running models for years",
    6:  "Why AI, Why Now",
    7:  "Discovery is getting harder and more expensive",
    8:  "Three things changed at once",
    9:  "Traditional rules vs. machine learning",
    10: "AI, ML, DL, LLMs — nested, not competing",
    11: "The only taxonomy you must remember",
    12: "The four generative tools you will actually meet at work",
    13: "Honest maturity of AI in exploration",
    14: "Module 01 in one line",
    15: "The Exploration Data Universe",
    16: "Four shapes of exploration data",
    17: "A real project's data inventory",
    18: "QA/QC is not a lecture — it is the whole project, continuously",
    19: "The Data Detective",
    20: "Below detection limit is not zero",
    21: "Spatial data breaks the standard assumptions",
    22: "Module 02 in one line",
    23: "From Field to Feature",
    24: "The one-page brief: turning an ambition into a testable question",
    25: "Six steps from rock to row",
    26: "Feature engineering is geology, written as arithmetic",
    27: "Features geologists engineer, by discipline",
    28: "Your training data is where geologists already looked",
    29: "Random split vs. spatial split — same data, same model",
    30: "How Machine Learning Actually Works",
    31: "A decision tree is an automated logging key",
    32: "How the machine chooses a threshold",
    33: "Overfitting, happening live",
    34: "Train, validate, test — and why geology needs a fourth rule",
    35: "Precision, recall, and the cost of being wrong",
    36: "Metrics, translated into exploration language",
    37: "Unsupervised learning — letting the geochemistry speak",
    38: "Anomaly detection beyond the single-element threshold",
    39: "Neural networks and deep learning, in one honest page",
    40: "Explainability — making a model testify",
    41: "Module 04 in one line",
    42: "AI Across the Exploration Value Chain",
    43: "The exploration value chain, stage by stage",
    44: "Mapping alteration from orbit",
    45: "Multivariate anomaly detection and vectoring",
    46: "From inversion to interpretation",
    47: "Computer vision on core — the most mature application in the industry",
    48: "3D modelling, domaining and resource estimation",
    49: "The plumbing behind every AI result: data governance",
    50: "Who is actually doing this, today",
    51: "Prospectivity mapping, done defensibly",
    52: "Match the application to the stage",
    53: "Case Study — Project Solstice",
    54: "The setting and the mineral system model",
    55: "What we actually have — and its honest state",
    56: "How Solstice's evidence layers became features",
    57: "You rank the targets — then the model does",
    58: "What the targeting committee actually decided",
    59: "Four holes later",
    60: "Module 06 in one line",
    61: "Where AI Fails",
    62: "Five ways a model misleads you — all seen earlier today",
    63: "The failures that survive good data",
    64: "Spot the Flaw",
    65: "The four questions — your validation checklist",
    66: "How to present a model result — and how to refuse one",
    67: "Module 07 in one line",
    68: "Tools & The Future Geologist",
    69: "Tools you will meet in a real exploration office",
    70: "What an LLM is good for in exploration — and what it is not",
    71: "Draft → verify → cite → review",
    72: "A realistic skills ladder, in order",
    73: "Where geology-plus-data actually leads",
    74: "What to do this week",
    75: "The vocabulary contract",
    76: "Where we started, and where we finished",
}

# ═════════════════════════════════════════════════════════════════════════════
# SPOKEN TRANSCRIPTS — all 76 slides (unchanged Arabic content)
# ═════════════════════════════════════════════════════════════════════════════
T = {}

T[1] = """أهلاً بيكم جميعاً، وقبل أي حاجة عايز أرحب بيكم في الورشة دي. النهارده إحنا مش جايين نتعلم برمجة، ومش جايين نحفظ أسماء Algorithms. إحنا جايين نفهم حاجة أهم بكتير: إزاي الـAI والـMachine Learning ممكن يدخلوا في شغل الـMineral Exploration من غير ما نفقد التفكير الجيولوجي في النص.

خلوا في دماغكم من أول دقيقة قاعدة واحدة، وهي القاعدة اللي هتتكرر معانا طول اليوم: أي Model هيطلع لنا Prediction، لكن الـPrediction مش هيبقى حقيقة جيولوجية لمجرد إن الكمبيوتر قاله. في النهاية، لازم حد يفهم الـevidence، يراجعها، ويقدر يدافع عنها مهنياً. الـCompetent Person في أي تقرير فني هو إنسان اسمه مكتوب، مش Model.

الـworkshop معمول في 9 modules و4 Acts. عندنا 25 live demonstration أثناء اليوم، وبعد كده في reference library فيها 12 module ترجعوا لها لما يبقى عندكم dataset حقيقية. يعني مش مطلوب إنكم تخرجوا النهارده قادرين تبنوا Model من الصفر. المطلوب إنكم تخرجوا قادرين تسألوا الأسئلة الصح لما حد يعرض عليكم Model.

تخيلوا معايا مثال عملي: Porphyry Cu-Au district. عندنا soil geochemistry بتشير لمركز معين، والـmagnetics بتشير لمركز تاني، والـalteration mapping بتشير لمنطقة تالتة. السؤال هنا مش: أي Layer نصدق؟ السؤال الحقيقي: إيه التفسير الجيولوجي اللي يفسر الاختلافات دي؟ AI ممكن يساعدنا نرتب الأدلة ونكتشف patterns، لكن معنى الـpattern لازم يرجع للجيولوجي.

الحاجة الأخيرة اللي عايز أقولها: الورشة دي معمولة geology-first. يعني كل مصطلح AI هنقوله، هنقوله بعد الفكرة الجيولوجية اللي بيوصفها. فلو حسيتوا إن فيه كلمة عدت من غير تعريف، اسألوا فوراً. الورشة دي بتاعتكم، مش بتاعتي."""

T[2] = """قبل ما ندخل في المادة، أحب أوضح مين اللي بيتكلم معاكم، وليه الموضوع ده قريب من شغلي. أنا Shehata Mekawy، وشغلي مرتبط بالـexploration data، والـgeological databases، والـQA/QC، والـautomation، والـmachine learning.

خلوني أوضح كل جزء من دول بشكل عملي. الـexploration data يعني إني بتعامل مع كل اللي بيطلع من الحقل: assays، collar surveys، geological logs، geophysics، remote sensing، وكل حاجة بتتحول لـdatabase. والـgeological databases يعني إني مسؤول إن الأرقام دي تكون مترابطة وقابلة للتتبع. والـQA/QC يعني إني أتأكد إن العينات اللي بتوصل من المختبر موثوقة، فيها blanks وduplicates وstandards. والـautomation والـmachine learning يعني إني بستخدم الكمبيوتر إنه يساعدنا نلاقي patterns في الكم الكبير من البيانات اللي مفيش حد يقدر يقرأه كله بعينه.

أنا مهتم بالجزء اللي بيربط بين الحاجات دي كلها. يعني مش مجرد إننا عندنا database، ولا مجرد إننا عندنا Model. القيمة الحقيقية لما البيانات تكون منظمة وموثوقة، وبعد كده نقدر نحولها إلى analysis يساعد الفريق ياخد قرار أفضل. أنا شغلي مش إني أطلع Map جميلة، شغلي إني أطلع Map يقدر الفريق يبني عليها قرار حفر ويدافع عنه.

وأنا عايزكم تتعاملوا مع خبرتي على إنها مثال عملي، مش authority لازم تصدقوها. أي فكرة هنقولها النهارده المفروض تتسأل: إيه الـevidence؟ وإيه الافتراض؟ وإيه اللي ممكن يخلينا نغير رأينا؟ أنا شخصياً اتعلمت أكتر من المشاريع اللي فشلت، مش من اللي نجحت. وأنا عايزكم تخرجوا من هنا بموقف نقدي، مش بحماس أعمى."""

T[3] = """خلونا نبص بسرعة على خريطة اليوم. إحنا عندنا 4 Acts، والـActs دي مش عشوائية — كل واحد بيبني على اللي قبله.

الـAct الأول Foundations، ده 3 modules: هنبدأ بالـOrientation اللي هو إحنا فيه دلوقتي، وبعدها Module 01 نسأل فيه: ليه AI أصلاً دخل مجال الـexploration؟ وإيه اللي اتغير في الصناعة؟ ثم Module 02 نسأل فيه: إيه شكل البيانات اللي عندنا؟ لأن شكل البيانات بيحدد الأدوات.

بعد كده Act II: Building Blocks. هنا هننقل الفكرة من geology إلى data ثم إلى features وmodels. هنفهم إزاي model بيتعلم فعلياً، وإيه معنى overfitting، وازاي نختبره بشكل عادل. ده الجزء التقني، لكن هنقوله بدون رياضيات.

Act III Applications: ده الجزء اللي الناس بتحب تشوفه — هنشوف الـAI في أجزاء مختلفة من الـexploration value chain، من remote sensing وgeochemistry وgeophysics لحد drilling والـ3D modelling والـtargeting. وهنعمل Case Study كامل اسمه Project Solstice.

وأخيراً Act IV Judgement: الجزء اللي في رأيي أهم من أسماء الـalgorithms كلها. إمتى النموذج يفشل؟ إمتى نرفض إجابته؟ إيه الأربع أسئلة اللي نسألها لأي Model؟ وإيه اللي نقدر نعمله كجيولوجيين من أول يوم بعد الـworkshop؟

وخليكم فاكرين إن الـreference library اللي بعد الـ5 ساعات مش مطلوب حفظها. اعتبروها manual ترجعوا له لما يكون عندكم مشروع حقيقي على الأرض. النهارده هنركز على المفاهيم الأساسية والـdemos، والباقي مرجع."""

T[4] = """دلوقتي عايز أعمل حاجة بسيطة قبل ما نبدأ: نقيس مستوى الغرفة. ده مهم جداً لأن كل اللي هنقوله بعد كده مبني على إنكم داخلين بمستوى معين.

الاستبيان ده مش امتحان. مفيش إجابة هنقول عليها صح أو غلط. أنا عايز أعرف أنتم داخلين بإيه: مين عنده programming experience؟ مين اشتغل GIS قبل كده؟ مين شاف Machine Learning في جامعة أو كورس؟ ومين كل اللي يعرفه عن AI هو إنه بيسأل ChatGPT أسئلة؟

ليه بسأل ده؟ لأن الورشة دي مبنية على فرضية إن اللي قدامي جيولوجيين أو جيوفيزيائيين، مش data scientists. فلو اكتشفت إن فيه حد في القاعة عنده خبرة برمجة قوية، هطلب منه يساعد جاره. ولو اكتشفت إن فيه حد ما سمعش عن Machine Learning خالص، هبدأ من الأساسيات.

المهم هنا إننا ما نبصش بس على الأغلبية. لو نصف القاعة عنده رأي والنصف التاني عنده رأي مختلف، الاختلاف نفسه مهم. لأنه هيخلينا طول اليوم نسأل: إيه الافتراض اللي خلّى الشخص ده يختار الإجابة دي؟

وفي آخر اليوم نقدر نرجع لنفس الأسئلة ونشوف إيه اللي اتغير. لو لقيت إن إجاباتك اتغيرت، ده دليل إن الورشة نجحت. الهدف مش إننا نحولكم لـdata scientists، الهدف إننا نوسع طريقة تفكيركم."""

T[5] = """الحقيقة إنكم كجيولوجيين بتعملوا أشكال من الـMachine Learning من زمان، حتى لو ما استخدمتوش الاسم ده. وده مش مجاملة، ده حقيقة تقنية.

خلونا نمشي على أربع أمثلة:

أولاً Classification — Supervised Learning. لما تمسك rock sample وتبص على اللون، grain size، texture، hardness، reaction to acid، وبعدين تقول altered andesite، أنت عملت بالظبط اللي supervised classifier بيعمله: عندك مجموعة attributes (اللي إنت شفتها)، وطلعت label (اللي إنت قلته). الفرق الوحيد إن الجهاز بيعمل ده على آلاف samples في ثواني.

ثانياً Regression. لما عندك hole فيها 1.2% Cu وحواليها hole تانية 0.4% Cu، وتحاول تقدّر إيه اللي ممكن يكون بينهم باستخدام distance والـgeological continuity، أنت بتعمل Regression: بتتنبأ بقيمة continuous من قيم معروفة.

ثالثاً Clustering — Unsupervised Learning. لما عندك geochemical population وبتحاول تفصل background عن anomalous population من غير answer key جاهز، ده بالظبط Clustering. أنت بتدور على structure في البيانات مش على إجابة صح/غلط.

رابعاً Anomaly Detection. لما تلاقي sample واحدة 4% Cu في survey أغلبه حوالي 60 ppm وتقول: استنى، دي لازم أراجعها قبل ما أصدقها، فأنت بتعمل Anomaly Detection بشكل بشري.

إذن الـMachine Learning مش طريقة تفكير غريبة. هو ببساطة بيأتمت جزء من pattern recognition على scale أكبر بكثير من الإنسان، وبسرعة مفيش بشر يقدر يوصلها. لكن الـmeaning — يعني إيه الـpattern ده جيولوجياً — يفضل مسؤولية الإنسان. الجهاز يلاقي النمط، الجيولوجي يقولنا النمط ده معناه إيه."""

# ═══ Module 01 ═══
T[6] = """بعد ما اتفقنا إننا بالفعل بنفكر بطريقة تشبه الـmodels، نبدأ بالسؤال الأهم: ليه AI، وليه دلوقتي؟

الموضوع مش hype فقط. عندنا مشكلتين متداخلتين في نفس الوقت: discovery أصبح أصعب وأغلى، وفي نفس الوقت حجم وتنوع البيانات زاد جداً لدرجة إن مفيش فريق بشري يقدر يقرأه كله.

خلوني أوضح إن دي مش دعوة لـAI. دي وصف لضغط حقيقي في الصناعة. فيه ثلاثة أهداف في نهاية الـmodule ده عايزكم تقدروا تحققوهم: أولاً، تقدروا تقولوا 3 ضغوط حقيقية بتدفع الصناعة ناحية AI. ثانياً، تشرحوا الفرق بين traditional programming وMachine Learning بشكل واضح لأي حد. ثالثاً، تفهموا ليه قيمة الحكم الجيولوجي بتزيد مع AI بدلاً من إنها تختفي.

النقطة الأخيرة دي مهمة جداً. فيه فكرة شائعة إن AI هيستبدل الجيولوجي. الحقيقة عكس كده: AI هيخلي الجيولوجي أهم، لأنه هيبقى الشخص الوحيد اللي يقدر يفسر الـpatterns وياخد قرار عليها."""

T[7] = """السؤال: ليه discovery بقى أصعب؟ فيه أربع أسباب حقيقية، وكل واحدة ليها consequence.

أول سبب: الـoutcropping deposits خلصت. معظم الـsearch space الجديد موجود تحت cover — يعني تحت عشرات أو مئات الأمتار من regolith، basalt، أو basin sediments. الجيولوجي مش شايف الحاجة بعينه، وبيعتمد على evidence غير مباشر.

ثاني سبب: التكلفة. Cost per discovery زاد لعقود بينما الـaverage grade والـsize بينزلوا. يعني بتدفع أكتر لتلاقي أقل. ده معناه إن كل قرار targeting له consequence مالي كبير.

ثالث سبب: demand. عندنا تحول طاقة عالمي — Cu للنحاس، Ni للبطاريات، Li، Co، REE. الطلب على المعادن دي بيعلى بسرعة، وإحنا محتاجين اكتشافات أكتر، أسرع، من أرض أصعب.

رابع سبب: الحفر هو الـbottleneck. A drill hole هو الـtest الحقيقي الوحيد، وهو أغلى حاجة في الاستكشاف. أي حاجة تحسّن ترتيب targets للحفر بتستحق تكلفتها بسرعة.

فالـAI هنا مش رفاهية. هو محاولة إننا نستخدم كل evidence موجودة عندنا بشكل أفضل، ونتجنب إننا نصرف 400,000 دولار على hole في المكان الغلط."""

T[8] = """فيه سؤال منطقي: الـAI مش جديد، موجود من الخمسينات. فليه بقى ينفع في exploration دلوقتي بالتحديد؟ الإجابة: لأن تلات حاجات عبروا threshold في نفس العقد.

أول حاجة: Data. الحكومات بقت تنشر nationwide magnetics، radiometrics، gravity، geochemistry، وdrill databases. وعشرات السنين من تقارير الشركات اتعملها scan وtext-mining. يعني البيانات اللي كانت مدفونة في أرشيف، بقت متاحة على الإنترنت.

تانياً: Sensors. عندنا دلوقتي hyperspectral core scanners، portable XRF، downhole geophysics، وأقمار صناعية بترصد كل حاجة. النتيجة: كل متر حفر بينتج أرقام أكتر من اللي فريق كامل يقدر يقرأها.

ثالثاً: Software. أدوات زي scikit-learn، PyTorch، QGIS، وopen notebooks بقت مجانية ومتوثقة. اللي كان محتاج PhD سنة 2005، بقى afternoen واحد سنة 2026.

النقطة المحورية: الـbottleneck اتنقل. مش بقى السؤال "هل نقدر نقيس؟" — السؤال بقى "هل فيه حد يقدر يبص على كل ده؟" وده بالظبط المكان اللي الـAI بيدخل فيه."""

T[9] = """دلوقتي خلونا نعمل مقارنة عملية بين rule مكتوبة بإيد جيولوجي وبين Machine Learning model. الاتنين بيحلوا نفس المشكلة: تقرر إذا كان drill interval prospective ولا لأ.

الـrule البسيطة: if Cu > 0.20% → Ore. دي قاعدة شفافة جداً. أقدر أشرحها لأي حد في ثانية، وأعرف بالضبط ليه عينة اتصنفت كده. هي transparent وinstantly auditable.

لكن المشكلة إنها بتستخدم feature واحدة. يعني لو عندي low-grade sulphide-rich interval فيه Cu قليل بس sulphide كتير، الـrule هتقول waste، والواقع إنه ممكن يكون mineralised. أو لو عندي high-Cu staining في barren rock (يعني copper بس مش من mineralisation)، الـrule هتقول ore، والواقع إنه مش كده.

الـML model يقدر يتعلم combination من features: Cu، S، magnetic susceptibility، veining density، وأكتر. ده بيخليه يكتشف relationships ما فكرتش أكتبها بنفسك.

لكن دي مش معناها إنه أذكى. هو فقط قادر يكتشف combinations كثيرة من أمثلة سابقة، وممكن يطبقها بثقة في مكان ما تنفعش فيه. تخيل إنه اتعلم من intervals في منطقة معينة فيها نوع معين من الـalteration، بعدين طبّق نفس الـpattern في منطقة تانية مالهاش نفس الجيولوجيا.

السؤال المهني المهم: إمتى rule بسيطة تكون أفضل من model؟ لو عندك knowledge واضح، قليل البيانات، ومتطلبات auditability عالية (يعني لازم حد يراجع القرار)، rule شفافة ممكن تكون الاختيار الأفضل. الـML مش دايماً الإجابة."""

T[10] = """خلونا نرتب المصطلحات، لأن الناس بتستخدمهم interchangeably وهي مش نفس الحاجة. تخيلوا 3 دواير، كل واحدة جوه التانية.

أوسع دايرة: AI — Artificial Intelligence. ده المظلة الكبيرة. أي software بيقلد human decision-making، من قواعد IF/THEN البسيطة لحد autonomous systems. فمثلاً tax software فيه AI، مش محتاج ML.

جواه: ML — Machine Learning. هنا إحنا مش بنكتب كل القواعد بإيدنا، إحنا بنخلي algorithm يتعلم statistical patterns من examples. يعني بنعطي للجهاز بيانات وإجابات، وهو يستنتج القاعدة. فيه 3 أنواع: supervised (labels معروفة)، unsupervised (مفيش labels)، reinforcement (trial and error).

جواه: DL — Deep Learning. ده جزء متخصص من ML بيستخدم neural networks متعددة الطبقات. قوي جداً مع الصور، الـspectra، الإشارات، والنصوص. ليه؟ لأنه بيعرف يبني features لوحده بدون ما إنت تقوله.

في المركز: LLMs. Large Language Models. ده تطبيق معين من DL للغة. زي ChatGPT. مفيد جداً في القراءة والتلخيص وصياغة النصوص والمساعدة في coding.

لكن خليكم حذرين جداً: LLM مش database query engine، ومش truth machine، ومش بديل عن geological validation. هو بيتعامل مع statistical patterns في البيانات اللي اتدرب عليها، وممكن بثقة يعطي إجابة غلط. وفي exploration تحديداً: لا شيء يصبح حقيقة لمجرد إن model قاله. Hole أو field evidence هو اللي يختبر الفرضية."""

T[11] = """دي أهم taxonomy في اليوم كله. كل application هنشوفها النهارده بتنتمي لواحد من أربع أنواع، ولو عرفت تحط أي claim في المكان الصح، هتعرف فوراً إيه السؤال النقدي اللي تسأله.

أولاً: Supervised Learning. عندي أمثلة ومعاها answer معروف. مثلاً عندي 1000 drill interval، كل واحد متصنف mineralised أو barren. الـmodel يتعلم من الأمثلة دي، وبعدين يتنبأ على intervals جديدة. السؤال النقدي: مين عمل الـlabels؟ في أي سنة؟ تحت أي standard؟ ولو فيه unexplored ground اتعاملت على إنها negative، دي مشكلة كبيرة.

ثانياً: Unsupervised Learning. مفيش answer key. الـmodel يحاول يكتشف populations أو structure جوّه البيانات. زي clustering على multi-element geochemistry. السؤال النقدي: هل الـclusters دي جيولوجية فعلاً ولا مجرد numerical groups؟

ثالثاً: Semi-supervised Learning. الواقع الحقيقي في exploration: عندك 12 hole assayed، وعندك 40,000 grid cell مش assayed. فبتستخدم الـ12 positive labels وتتعلم من الباقي. ده اللي بنسميه positive-unlabelled learning.

رابعاً: Reinforcement Learning. الـmodel يتعلم من trial and error باستخدام rewards. زي إنه يقرر مكان drill hole، أو يجدول rigs. ده emerging في mining، نادر في exploration targeting حالياً.

القاعدة الأساسية: نوع السؤال هو اللي يحدد نوع التعلم، مش إننا نبدأ من algorithm ونحاول نلاقي له مشكلة."""

T[12] = """فيه 4 أدوات generative AI فعلية موجودة في مكاتب exploration دلوقتي، وكل واحدة ليها failure mode مختلف.

أول أداة: Text LLMs. text-in, text-out. بتستخدم للـreasoning، editing، writing code، وتحويل نص فوضوي إلى tables. مثلاً عندك letter assay مكتوبة سنة 1987، بتصورها scan، والـLLM يحولها لصف في spreadsheet. مفيد جداً في archaeology البيانات.

تاني أداة: Multimodal Models. تستقبل نص، صورة، وصوت. مثلاً تقرأ core photo مع logging notes بتاعها، أو تسمع voice memo من الحقل وتحطها في الـhole ID الصح. مفيدة لما البيانات فيها أكتر من نوع.

تالت أداة: Embeddings + Retrieval. ده أهم واحدة للقيمة التجارية. كل تقرير تاريخي يتحول لـnumeric fingerprint، وبعدين تبحث بـmeaning مش بكلمات. يعني لو بتدور على "skarn with retrograde alteration"، الأداة تلاقي الـmemo سنة 1974 اللي ما استخدمش الكلمات دي بس قصد نفس المعنى. ده اللي بنسميه RAG — Retrieval Augmented Generation.

رابع أداة: Agents / Tool Use. ده model بيستدعي software نيابة عنك. يسأل drill database، أو يشغل QGIS step. قوي جداً، وبرضه أخطر واحدة، لأنه بيعمل actions مش بس بيتكلم. دي اللي لازم تراقبها بعين مفتوحة."""

T[13] = """دي شريحة صريحة: honest maturity check. إيه اللي فعلاً شغال في الصناعة النهارده، وإيه اللي لسه conference slide؟

اللي شغال بالفعل ورتبة Routine: Automated core photo / RQD measurement — دي vision task واضحة، labels كثيرة، وسهل تتأكد بعينك. Alteration mapping من multispectral imagery — الفيزياء معروفة، وdecades of validation. Multi-element geochemical anomaly detection — إحصائيات mature، والجيولوجي يقدر يتحقق منها.

اللي شغال ومتعارف عليه Common: Lithology prediction من downhole geophysics — بيشتغل كويس جوه deposit واحدة، لكن transfer بين districts ضعيف.

Common but contested: District prospectivity mapping. شغال لكن فيه جدل كبير. ليه؟ لأن عندك عدد قليل جداً من positive examples، والـvalidation genuinely hard. صعب تعرف إذا الـmodel شغال فعلاً ولا لأ.

Emerging: Fully automated 3D geological modelling. Implicit modelling بقى standard، لكن unsupervised interpretation لسه مش جاهز.

Marketing: AI "discovering" a deposit unaided. مفيش documented case واحد. كل الحالات فيها geologist عمل framing، filtering، وdrilling.

القاعدة: لما vendor يقولك "الـAI بتاعنا بيكتشف deposits لوحده"، اسأله: ورّيني الـdrill results والـbase rate. السؤال ده سؤال جيولوجي، مش سؤال data scientist."""

T[14] = """نقفل Module 01 بفكرة واحدة بس عايزها تفضل معاكم اليوم كله: AI مش سبب جديد يجعلنا نتوقف عن التفكير الجيولوجي. بالعكس، كل ما زادت قدرة الأدوات على اكتشاف patterns، زادت مسؤوليتنا في تفسيرها واختبارها.

فكر معايا: لو model أعطاك 10,000 target محتمل، مش معنى كده إنك عندك 10,000 اكتشاف. عندك 10,000 hypothesis تحتاج filtering. والـfiltering ده شغل جيولوجي بحت.

تخيل الـfunnel من 10,000 كيلومتر مربع لحفرة واحدة. الـfunnel ده بيتضيق بسبب قرارات. الـAI يقدر يوسّع الـtop بتاع الـfunnel بشكل هائل — يقدر يقرأ مئات الـlayers كلها مرة واحدة. لكن كل خطوة تضييق بعد كده، محتاجة جيولوجي يربط الـpattern بمعنى حقيقي في الدنيا.

والـprofessional geologist لازم يسأل: هل النتيجة قابلة للتفسير؟ هل البيانات سليمة؟ هل الاختبار عادل؟ وهل القرار الناتج يستحق تكلفة field أو drilling؟

من هنا نروح للسؤال الطبيعي: كل الكلام ده مبني على data. طيب شكل بيانات exploration أصلاً عامل إزاي؟"""

# ═══ Module 02 ═══
T[15] = """قبل أي algorithm، لازم نعرف شكل البيانات. ده Module 02، وهو اللي بيفصل الجيولوجي الحقيقي عن الهاوي.

هنقسم exploration data إلى أربع أشكال مختلفة: tabular، spatial، image، وtext. وفي بعض الحالات time-series تدخل كنوع مستقل عملياً.

ليه الشكل مهم؟ لأن شكل البيانات بيحدد الأدوات اللي منطقياً تنفع معها. ما ينفعش نعامل core photo بنفس طريقة assay table. الـimage تحتاج CNN، الـtable تحتاج tree-based models. والـspatial data تحتاج معالجة خاصة للـautocorrelation.

وفي نهاية الـmodule ده عايزكم تقدروا تعملوا تلات حاجات: أولاً، تصنفوا أي dataset لأحد الأشكال الأربعة. ثانياً، تعرفوا أهم QA/QC checks اللي بتحدد إذا كانت dataset جاهزة للـmodelling ولا لأ. ثالثاً، تفهموا ليه رقم واحد غلط ممكن يكون أخطر من قيمة missing. والسبب: الـmissing بتعلن عن نفسها، إنما الـغلط بتخبى جوه الجدول.

النقطة الأخيرة دي مهمة جداً في exploration، لأن الأرقام بتتولد من مصادر مختلفة على مدى سنين طويلة، ومعنى الرقم الواحد ممكن يتغير حسب السنة والمختبر والجهاز."""

T[16] = """خلونا نمشي على الأشكال الأربعة واحدة واحدة، وأديكوا مثال عملي من exploration لكل واحدة.

Tabular data: rows وcolumns، كل صف sample. أمثلة: assay tables، collar surveys، geochemistry، petrophysics، QA/QC records. ده أكتر شكل شائع في exploration. الأدوات المناسبة: decision trees، random forest، gradient boosting، logistic regression. تخيل المفاجأة — boosted trees بتغلب deep learning على البيانات دي في معظم الحالات.

Spatial data: أي حاجة مرتبطة بإحداثيات أو grids. أمثلة: geological maps، magnetics، gravity، radiometrics. الأدوات: spatial statistics، kriging، وأي ML لازم يراعي المسافة والاتجاه.

Image data: pixels، يعني core photos، scans، satellite imagery، hyperspectral cubes. الأدوات: computer vision، convolutional neural networks (CNNs)، image segmentation. هنا الـdeep learning بيتألق فعلاً.

Text data: free-form language، مش في table. أمثلة: historical reports، geological descriptions، emails، field notes. الأدوات: NLP، LLMs، embeddings، information extraction.

الخطأ الشائع اللي بيحصل كتير: حد يسأل "إيه أحدث AI؟" السؤال الأصح: "إيه شكل بياناتي؟" لأن الشكل هو اللي يحدد الأداة، مش العكس. والفشل في Exploration كتير بيكون سببه إن حد استخدم أداة متطورة على شكل بيانات مش مناسب ليها."""

T[17] = """دي واحدة من أهم الشرائح العملية في الورشة كلها: data inventory. وأنا عايزكم تاخدوها كـtemplate لكل مشروع.

قبل ما تقول "هنعمل AI"، اكتب كل dataset عندك، شكلها، حجمها، coverage، وأهم quality trap. الجدول ده هو اللي بيحدد الـmodel إيه المسموح يعمله، وإيه اللي هو مش هيقدر يعمله من الأساس.

خلونا نمشي على الأمثلة:

Surface geological map — شكلها spatial polygons، بمقياس 1:100k لـ1:25k. الـquality trap: هي interpretation مش measurement، ولها author. يعني حد معين رسمها في سنة معينة بناءً على رأيه. الـmap مش fact.

Soil / stream geochemistry — tabular + spatial، من 10^3 لـ10^5 sample × 50 elements. الـquality trap: multiple labs عبر السنين، detection limits اتغيرت، وفيه samples ما اتعملهاش re-assay.

Airborne magnetics / radiometrics — raster grid، من 10^6 لـ10^8 cell. الـquality trap: surveys مختلفة ارتفاعات وline spacings ممكن تت stitch مع بعضها، والـstitching ده بيخلق patterns مصطنعة.

Drill collars + downhole surveys — tabular + 3D، من 10^3 لـ10^4 hole. الـquality trap: coordinate systems غلط، dip/azimuth ناقص، وlegacy datums.

Assay intervals — tabular، من 10^4 لـ10^6 interval. الـquality trap الأكبر: below-detection values متشفرة كـ0، أو -1، أو blank، أو 'ND'.

Geological logs — text + coded. الـquality trap: كل logger عنده vocabulary مختلف، وكل سنة عنده مصطلحات جديدة.

Core photography — image، من 10^3 لـ10^6 image. الـquality trap: wet/dry differences، lighting مختلف، scale card ناقص.

Historical reports — PDF. الـquality trap: scanned images بتخلي النص صعب استخراجه، والنتائج بتتذكر بدون methods.

لاحظوا حاجة مهمة: معظم الـtraps مش عن volume. هي عن consistency of meaning. البيانات بتزيد، لكن معناها بيتغير مع الزمن."""

T[18] = """QA/QC هنا مش chapter منفصل نعمله مرة وننساه. هو أساس المشروع كله، والـAI مش هيعرف يشتغل من غيره. عايز أقول جملة واحدة تركزوا عليها: a model trained on unvalidated assays launders bad data into confident maps. يعني الـmodel بيغسل البيانات السيئة ويطلعها على شكل خريطة واثقة.

فيه أربع checks أساسية:

أولاً: Blanks. مواد فاضية (barren material) بتتحط في sample stream. لو blank رجعت 300 ppm Cu، دي كارثة. مش مجرد sample واحدة سيئة — ممكن يكون فيه carry-over من العينة اللي قبلها، ونبدأ نشك في كل العينات المحيطة. لازم نوقف ونعيد التحليل.

ثانياً: Duplicates. بتفصل بين sampling variance وanalytical variance. Field duplicates بتوريك قد إيه الـsampling نفسه variable. Coarse duplicates (بعد crushing) وpulp duplicates (بعد pulverising) بيفصلوا بين أنواع مختلفة من الـnoise. الـduplicates بتحدد الـnoise floor الحقيقي — وأي model مش هيقدر يتغلب عليه.

ثالثاً: Standards / CRMs (Certified Reference Materials). دي عينات قيمتها معروفة. بتقولك هل المختبر accurate، مش بس precise. Drift في batch كامل ممكن يخلي كل الـassay run غير صالح، ويعمل trend وهمي في الخريطة.

رابعاً: Umpire Lab. عينة subset بتتعاد في مختبر تاني. Systematic bias بين المختبرين بيظهر على الخريطة كأنه geological boundary. الـmodel مش هيعرف يفرق.

والجملة الأخيرة الأهم: model مش هيعرف إن boundary اللي شايفها هي lab boundary مش lithological contact. الـQA/QC هو اللي يسمح للجيولوجي يعرف."""

T[19] = """دلوقتي هنشتغل Data Detective. عندنا export من assay table شكله طبيعي، لكن فيه مشاكل مخفية. المطلوب: تلاقوا المشاكل السبعة.

قبل ما نبدأ، قاعدة: ما تفترضوش إن كل رقم صالح لمجرد إنه موجود في CSV. الأرقام ممكن تكون تشفر حاجات مختلفة.

خلونا نمشي على الأمثلة:

Interval من 116 إلى 115 متر: واضح إن From أكبر من To. ده مستحيل فيزياً، لازم نراجعه.

Lithology مرة DIOR ومرة diorite: semantic inconsistency. نفس المعنى، بس spelling مختلف. لو ما وحدناهاش، الـmodel هيتعامل معاهم كـclasses مختلفة.

قيمة -9 في Cu: ده مش رقم حقيقي. ممكن يكون code لقيمة missing، أو below detection limit. لو تعاملنا معاها كرقم حقيقي، هنحط قيمة سالبة في التحليل، وهنفسد كل الإحصاءات.

Au فيها dash (-): ده placeholder. معناه القيمة إما missing أو below detection. تختار إزاي تتعامل معاها بيأثر على كل التحليل.

قيمة 31.5 في Cu: هل دي حقيقية؟! في منطقة أغلبيتها أقل من 1%. نراجع — هل units صحيحة؟ هل فيه decimal shift؟ هل ده typo؟

قيمة 0.00: صفر في assay ده مش zero حقيقي، ده غالباً below detection. لو حطيناه صفر، هنخلق spike اصطناعي، وهنفسد كل الـratios.

Lithology مرة GDIOR ومرة DIOR: واضح إن الـG زايدة. GL، gl، GDIOR، DIOR — كلهم لنفس الـlithology.

الـهدف مش إننا "ننظف الجدول" بأي ثمن. كل cleaning decision لازم يكون له سبب جيولوجي وdocumented rule. لو عملت قرار، اكتبه. لأن في سنة كمان، لما حد يرجع للمشروع، لازم يفهم إنت عملت إيه بالظبط."""

T[20] = """Below Detection Limit — دي واحدة من أكثر الأخطاء اللي ممكن تغير anomaly map بالكامل. وهي موجودة في معظم المشاريع اللي بشوفها.

خلونا نفهم المشكلة من الأول: لو القيمة أقل من detection limit، ده لا يعني صفر. معناها ببساطة إن المختبر لم يقدر يقيسها بدقة تحت حد معين. القيمة موجودة، بس إحنا مش عارفينها بالظبط.

لو حوّلناها إلى صفر، بنعمل حاجتين سيئتين: أولاً، بنخلق spike اصطناعي عند zero مش موجود في الطبيعة. ثانياً، بنفسد كل الـratios — Cu/Zn مثلاً، لو Zn اتحول لصفر، الـratio يبقى infinity.

ولو حذفنا كل الصفوف اللي فيها below detection، بنفقد samples اللي بتحدد شكل الـbackground. وده معناه إن كل اللي يتبقى هيبدو anomalous. الـanomaly مش إن القيمة عالية — الـanomaly إن القيمة عالية بالنسبة للـbackground. لو فقدنا الـbackground، فقدنا الـcontext.

الحلول الممكنة:

Substitution convention: نصف detection limit شائع، لكن لازم توثّق الافتراض، وتختبر هل النتيجة تتغير لو غيرت الـconvention.

الأفضل علمياً: Treat as censored data. يعني statistical methods مصممة للتعامل مع "known to be less than X". وفي نفس الوقت تحتفظ بـflag column يوضح للـmodel أي القيم كانت imputed.

النقطة الأخيرة: كل imputation هو افتراض جيولوجي أو إحصائي. ما تخبيهوش داخل رقم من غير ما توثقه. وحاجة كمان: watch for elements اللي detection limit بتاعها اتغير mid-project. التغيير ده بيعمل fake time-series trend، والـmodel ممكن يتعلمه على إنه geological signal."""

T[21] = """Spatial data تكسر افتراضات كثيرة من الـstandard machine learning. وده موضوع مهم جداً في exploration تحديداً.

في البيانات العادية، ممكن نتعامل مع rows على إنها observations منفصلة نسبياً. يعني لو بتحلل customer data، كل customer مستقل عن التاني. لكن في geology، sample جنب sample غالباً مرتبطين بنفس lithology والstructure والـalteration.

خلونا نفهم الـassumptions الأربع اللي بتتكسر:

أولاً: Spatial autocorrelation. Sample اللي على بعد 5 متر بتقول نفس الحاجة تقريباً. لو عالجتهم كـ"two independent facts"، بتضخم الـconfidence بشكل هائل. الـmodel هيبقى واثق جداً، لكن الثقة دي مبنية على وهم الاستقلال.

ثانياً: Support and scale. A 1kg soil sample، a 2m core interval، a 200m magnetic pixel — دي كلها أحجام مختلفة جداً. Mixing بينهم من غير تفكير فيه silent error.

ثالثاً: Anisotropy. Continuity along a shear أو stratigraphic horizon أكبر بكثير من continuity across it. لو الـmodel isotropic (بيفترض إن كل الاتجاهات متساوية)، هيمسح الـgrade عبر الـcontact.

رابعاً: Third dimension and time. العمق مش مجرد column — weathering، oxidation، and structural overprints كلهم بيتغيروا معه. وكذلك survey year.

لو الـmodel مش بيحترم distance، direction، وsupport، هو بيعمل statistics على coordinates، مش geology. والفرق بين الاتنين كبير جداً."""

T[22] = """نقفل Module 02 بتلات رسائل عايزكم تحفظوهم.

أولاً: اعرف شكل data قبل اختيار tool. الـshape هو اللي يحدد الأداة، مش الـhype.

ثانياً: QA/QC هو أساس الـmodel، مش مرحلة جانبية. الـmodel بي amplify الـdiscipline اللي إنت جبته مع البيانات. لو البيانات نظيفة، الـresults نظيفة. لو البيانات وسخة، الـmodel بيوسخها ويرجعها لك بشكل جميل ومقنع.

ثالثاً: في exploration، البيانات المرتبطة مكانياً تجعل طريقة الـsplit والـvalidation موضوعاً جيولوجياً بقدر ما هو موضوع إحصائي. يعني الـvalidation design هو قرار جيولوجي، مش قرار data scientist.

لو الرقم غلط، model ممكن يتعلم الخطأ بثقة. ولو الرقم missing، على الأقل أنت عارف إن عندك فجوة، وممكن تختار تتعامل معها.

جملة أخيرة، وهي الـsticky takeaway بتاعة الموديول ده: Garbage in, confident garbage out. الـAI مش هينظف البيانات بتاعتك. هو هي amplify أي discipline إنت جبته مع البيانات، وهيرجعلك النتيجة بلون أحمر وأخضر وهيبة كأنها حقيقة.

ومن هنا ننتقل للسؤال: إزاي نحول rock observations والـspatial evidence إلى features يقدر model يستخدمها؟"""

# ═══ Module 03 ═══
T[23] = """دلوقتي نبدأ Act II: Building Blocks. Module 03 هو الجسر بين geology والـmachine learning، وأنا بعتبره أهم موديول في الورشة لأنه اللي بيحدد إذا كان المشروع هينجح ولا يفشل.

الـmodel لا يرى "fault" ولا "alteration" ولا "fertile intrusion" كأفكار جيولوجية. هو يرى numbers. ودي حقيقة قاسية لكنها مهمة نفهمها من الأول.

يعني إحنا محتاجين نعمل translation: من observation إلى feature، ومن feature إلى model-ready row. الـtranslation ده هو شغل الجيولوجي، مش شغل data scientist.

لكن قبل أي feature، لازم نحدد القرار اللي عايزين نساعد فيه. هل بنرتب targets للحفر؟ بنصنف lithology؟ بنكتشف anomalies؟ كل سؤال له dataset وlabel مختلفين. ولازم نحدد ده قبل ما نبدأ نكتب أي code.

فيه فكرة عايز أقولها من الأول: 80% من شغل أي مشروع AI في exploration هو مش الـalgorithm. هو إننا نجمع 6 جداول فوضوية في جدول واحد الـmodel يقدر يقرأه. الـalgorithm هو أرخص جزء وأكتر جزء قابل للاستبدال."""

T[24] = """خلونا نتكلم عن الـone-page brief. دي حاجة عايزكم تعملوها في أول يوم من أي مشروع AI، وقبل ما تفتحوا أي software.

"هل نقدر نستخدم AI في المشروع ده؟" — دي مش سؤال. الـmodel مش هيقدر يجاوبه. فيه 6 سطور بتكتبها، ودي اللي data scientist هيسألك عليها في أول يوم:

السطر الأول: The decision. سمّي القرار اللي النتيجة هتغيره. أي 5 targets هتتحفر الأول؟ أي 200 core tray هتتعمل لها re-logging؟ أي soil grid هتتعمل لها infill؟ لو مفيش decision، مفيش project.

السطر الثاني: The unit of observation. One row يساوي إيه بالظبط؟ 100×100m grid cell، 2m assay interval، core photo، whole hole؟ كل نقاش عن scale وsupport بتبدأ من هنا.

السطر الثالث: The label, defined in geology. "Mineralised" معناها إيه بالظبط؟ أكتر من 0.2% Cu على 10 متر؟ Logged potassic alteration؟ مين اللي قرر؟ في أي سنة؟ تحت أي standard؟

السطر الرابع: The evidence you will allow. اكتب كل layer وهتقبلها ليه. أي حاجة بتسجل exploration history (roads، tenement edges، survey year) لازم تطلع من الأول.

السطر الخامس: The validation design. أي ground هتتعزل؟ ليه هي geologically independent؟ قرر ده قبل ما تدرب أي حاجة.

السطر السادس: The cost of each error. False positive تكلفته إيه (hole بـ400k دولار)؟ False negative تكلفته إيه (اكتشاف فايت)؟ النسبة دي، مش accuracy، هي اللي تحدد الـthreshold.

الصفحة دي هي أهم صفحة في المشروع كله. أغلب المشاريع بتفشل في السطور 1 و3، مش في الـalgorithm."""

T[25] = """خلونا نمشي على الـpipeline: ست خطوات من rock إلى row. التسلسل ده واحد سواء كنت بتتنبأ بـlithology في deposit واحدة ولا prospectivity عبر craton كامل.

الخطوة الأولى: Collect & validate. اجمع assays، logs، surveys، grids. تحقق من collars، datums، units، dates. راجع QA/QC records قبل أي حاجة تانية.

الخطوة التانية: Clean. تعامل مع below-detection values، duplicates، قيم مستحيلة (زيك negative thickness أو 130% total)، ووحد الـvocabulary في الـlogs. استخدم same codes في كل مكان.

الخطوة التالتة: Integrate. اربط الجداول على hole ID وdepth interval. Sample rasters عند sample points. حط كل حاجة في coordinate system واحدة وsupport واحدة.

الخطوة الرابعة: Engineer features. ضيف الكميات اللي الجيولوجي فعلاً بيفكر بيها: ratios، alteration indices، distance-to-structure، gradients، depth-normalised values.

الخطوة الخامسة: Split spatially. اعزل whole blocks أو whole prospects، مش random rows. القرار الواحد ده هو اللي بيفصل بين نتيجة شريفة ونتيجة وهمية.

الخطوة السادسة: Train, validate, interrogate. درب الـmodel، قيّمه على ground ما شافهوش، وبعدين فسّره جيولوجياً. لو مش قادر تفسّره، مش قادر تدافع عنه.

لاحظ حاجة: الـalgorithm نفسه جاء متأخر جداً في الـpipeline. ده مقصود. في الممارسة العملية، الخطوات 1-3 بتاخد 60-80% من وقت المشروع. لازم تعمل budget لده، وتقول لـmanagement بصراحة إن ده الـexpectation."""

T[26] = """دلوقتي نوصل لجزء مهم: Feature engineering. اسمعوا الجملة دي كويس: Feature engineering is geology, written as arithmetic. يعني الـfeature engineering مش coding، ده جيولوجيا مكتوبة بأرقام.

خلونا نمشي على الأمثلة من الشريحة:

Cu/Mo ratio: بدل Cu لوحدها، الـratio بيشير للـcentre، وبيتمسك رغم الـdilution من الـcover والـregolith. ليه؟ لأن الـratio بيمسح الـabsolute concentration.

Zn/Cu ratio: بيتزايد كل ما تبتعد عن المركز. يعني بيدينا direction، مش بس intensity. اللون الأحمر بيقول فين المركز، بس السهم اللي بيقول من فين جه.

Alteration index (K/Al): بيكمّي الـpotassic alteration من الـmajor elements. يعني بيحول الفكرة الجيولوجية "potassic alteration" لرقم.

Distance to structure: بيمثل fluid pathway priority. الجيولوجي عارف إن الـfaults بتعمل conduits للـfluids، فالـdistance بقى feature.

CLR (Centred Log-Ratio) transform: ده بيعالج مشكلة إن الـassays هي compositional data — يعني بتجمع لـ100%. لو استخدمت النسب الخام، الـcorrelations بتتكسر، فمحتاج log-ratio transforms.

Cover thickness correction: من غيرها، الـmodel بيتعلم الـcover thickness، مش الـmineralisation.

الحاجة المهمة اللي عايز أقولها: لاحظوا إن الـgains بتقل كل ما الـfeatures تتداخل. 20 feature correlated مش أفضل من 6 features كويسين. العكس — بيخلي الـmodel أصعب في التفسير.

ومتى تعرف إن feature مفيدة؟ لو حسّنت الـscore، وفسّرتها جيولوجياً، وما تكرر feature تانية. لو حسّنت الـscore بس مش قادر تفسّرها، اتعامل معاها بارتياب."""

T[27] = """دي شريحة reference عايزكم تحفظوها. كل feature هنا هي طريقة تحويل فكرة جيولوجية لرقم.

Geochemistry:
— Cu/Mo, Zn/Pb, Au/As, Sr/Y: pathfinder ratios بتوجه نحو المركز، وبتنجى من الـdilution أكتر من القيم الخام.
— Alteration indices (AI, CCPI), CIA: بتكمّي sericite/chlorite/carbonate intensity من الـmajor elements.
— Log-ratio (CLR/ILR) transforms: لأن assays compositional، بتجمع لـ100%. النسب الخام بتكسر الـcorrelation maths.

Geophysics:
— Analytic signal, tilt derivative, 1VD: edge-detection على الـmagnetics. بتوضح الـcontacts والـstructures بدل الـbulk response.
— Depth slices from inversion models: بتحول 3D property model لـlayer features قابلة للاستخدام في 2D map.

Structure:
— Distance to nearest fault / intersection: fault intersections هي conduits كلاسيكية للـfluids. الـproximity control حقيقي.
— Fault density, orientation deviation: damage-zone intensity كـcontinuous variable بدل خط على الـmap.

Remote sensing:
— Band ratios, clay/iron oxide indices: mineralogical proxies مباشرة من spectral absorption features.

Drilling:
— Depth-normalised grade, downhole gradient: بيفصلوا true tenor عن oxidation وsupergene enrichment effects.

Geology:
— One-hot lithology, alteration rank: بيحول categorical observations لأرقام من غير ما نخترع order كاذب.

لما حد يسألك "إيه هتfeed الـmodel؟"، الجدول ده هو إجابتك."""

T[28] = """دي أعتقد أصعب مشكلة في exploration AI كله: إن training data بتاعتك مش عينة عشوائية من الـcrust. هي بتاعة أماكن الجيولوجيين راحوا وبصوا فيها.

Drill holes مش موزعة عشوائي. بتتركز حول roads، outcrops، historical workings، و"نتيجة السنة اللي فاتت الحلوة". يعني الـmodel اللي بيدرب على البيانات دي بيتعلم exploration history بقدر ما بيتعلم geology.

خلونا نمشي على المشاكل الأربع:

أولاً: Sampling bias. لو كل hole mineralised كانت قريبة من road، الـ"distance to road" هيبقى أهم predictor في الـmodel. وده مش metallogenic control. لكن الـmodel مش هيعرف يفرق.

ثانياً: Spatial data leakage. Random train/test split بيحط hole's neighbour على بعد 10 متر في الـtest set. الـmodel بيحفظ "near this coordinate, grade is high" ويطلع accuracy 95%. الـ95% دي هي interpolation، مش prediction.

ثالثاً: Absence is not absence. Unlabelled ground أغلبه unexplored، مش barren. لو عاملناها على إنها negatives، بنقول للـmodel إن unexplored = empty. ده خطأ كبير.

رابعاً: Label noise. Lithology logs من أربع جيولوجيين على مدى 15 سنة بتشمل أربع vocabularies مختلفة وتلات types من granodiorite. الـlabels نفسها فيها noise.

الـسؤال المحوري: هل الـmodel بيتنبأ بالجيولوجيا، أم بيتنبأ بأماكن الحفر السابقة؟ الـاتنين بيبانوا بنفس الشكل على الخريطة.

الـmitigations: spatial cross-validation by block أو prospect، presence-only / PU learning methods، dropping proxy features، وreporting دايماً إزاي الـpositives اتاختارت."""

T[29] = """الشريحة دي بتوضح حاجة بسيطة لكن مدمرة: same data, same model, النتيجة بتختلف حسب طريقة اختيار الـtest set.

السيناريو الأول: Random 80/20 row split. النتيجة: accuracy = 0.96. الرقم ده جميل جداً، وهو اللي بيتحط في الـpresentation. لكن الحقيقة: test intervals قريبة من training intervals في نفس الـholes، أو على نفس الـprospect. الـmodel بيحفظ "near this coordinate, grade is high". النتيجة هي measure of interpolation، مش prediction. لما تيجي تستخدمه على ground جديدة، مش عارف هيشتغل إزاي، والأغلب إنه هيشتغل بشكل سيء.

السيناريو التاني: Leave-one-prospect-out split. النتيجة: accuracy = 0.71. الرقم أقل، لكنه honest. الـmodel لازم ينقل لـground مشافهاش. الـperformance دلوقتي بيعكس السؤال الحقيقي للـexploration: هل النموذج يقدر يشتغل على ground جديدة؟

والـ0.71 ده كمان بيكشف حاجة مهمة: أي prospects هي geologically atypical. وده useful في نفسه.

الـverdict: الرقم المنخفض، الرقم الصادق، هو اللي تقدر تدافع عنه في technical review.

القاعدة: لما تشوف accuracy عالية بشكل مريب على spatial data، أول سؤال: كيف الـtest set اتعزلت مكانياً؟"""

# ═══ Module 04 ═══
T[30] = """Module 04 هنفهم فيه ما الذي يحدث فعلياً داخل model — لكن من غير ما نحول workshop لمحاضرة mathematics. مش هتشوفوا equations، ومش هنشتغل رياضة.

هنستخدم Decision Tree كنموذج ذهني بسيط، لأنها أسهل واحدة في الفهم، ولأنها فعلًا بتشتغل كويس على البيانات الجدولية بتاعتنا. بعدها هنفهم overfitting، training/validation/test، confusion matrix، precision/recall، anomaly detection، neural networks، وأخيراً explainability.

الهدف مش إنكم تخرجوا قادرين تبنوا Models. الهدف إنكم لما تشوفوا Model في مشروع حقيقي، ما يكونش بالنسبة لكم صندوق أسود كامل. تكونوا قادرين تسألوا الأسئلة الصح: البيانات دي اتعلم منها إيه؟ وليه ادى النتيجة دي؟"""

T[31] = """Decision Tree ممكن تتخيلها كأنها سلسلة أسئلة. أنت أصلاً بتستخدم حاجة شبه دي في الحقل، بس ما سميتهاش بالاسم ده.

خلونا نبدأ بمثال بسيط: عايز أفرق بين Diorite وGranite. الـtree بتسأل: هل magnetic susceptibility أكبر من threshold؟ نعم → احتمال Diorite. لا → احتمال Granite. بعدين تسأل سؤال تاني: هل density أكبر من threshold؟ نعم → ... إلخ.

في كل خطوة، الـtree بتسأل سؤال واحد، بإجابة نعم أو لا. في النهاية بتوصل لـclass أو prediction.

الـtree بتتعلم thresholds من training data بدلاً من إن الجيولوجي يكتب كل threshold بنفسه. يعني هي بتلاقي أفضل نقطة تقسم فيها البيانات.

وده يخليها سهلة نسبياً في الفهم: prediction ممكن تتبع مسارها خطوة بخطوة، وتعرضها في technical review وواحد يجادلها. Trees هي فعلاً أداة social في exploration.

لكن البساطة دي لها ثمن. لو سمحت للشجرة تكبر جداً، ممكن تحفظ training data كلها. ودي أول علامة على overfitting. لو الشجرة وصلت لـdepth 30 على 500 sample، هي فعلاً حفظتهم مش اتعلمتهم."""

T[32] = """خلونا trace prediction واحدة خطوة بخطوة. ده مثال من الشريحة:

Sample عندها magnetic susceptibility = 1.2 SI، density = 2.95 g/cm³، depth = 145 متر.

السؤال الأول: هل magnetic > 0.8؟ نعم → نروح branch اليمين.

السؤال الثاني: هل density > 2.9؟ نعم → نروح branch تاني.

السؤال الثالث ممكن يكون عن depth، أو عن أي feature تانية. في النهاية نوصل لـprediction: مثلاً Diorite.

أنا عايزكم تشوفوا إن الـmodel مش سحر. في tree بسيطة، ممكن فعلياً تتبع الـreasoning path وتقول "هو وصل للنتيجة دي لأن السؤال الأول والسؤال التاني".

لكن هنا في نقطة مهمة جداً: لازم نفرق بين "أقدر أتتبع المسار" وبين "المسار صحيح جيولوجياً". الـmodel ممكن يكون explainable — يعني تقدر تتبع كل خطوة — لكن الـmodel مبني على biased training data. فهو بيعطي نتيجة واضحة، بناءً على assumptions غلط.

مثال: لو كل الـtraining intervals اللي فيها Diorite كانوا في منطقة واحدة، الـmodel هيتعلم إن الـ"depth > 145" معناها Diorite، بس ده مش صح جيولوجياً. هو بس اتعلم pattern في البيانات، مش pattern في الطبيعة."""

T[33] = """Overfitting — دي الشريحة الأهم في اليوم كله، ولو خرجت بحاجة واحدة من الورشة، خرجت بإنك تفهم الـoverfitting.

خلونا نستخدم تشبيه طالب: طالب حفظ إجابات امتحان السنة اللي فاتت بدون ما يفهم المادة. لو نفس الامتحان جه، يجيب 100%. لكن لو غيرت الأسئلة، يجيب 20%.

نفس الشيء في model. الـoverfitting هو إن الـmodel يتعلم training examples بدقة أكبر من اللازم، بدل ما يتعلم الـpattern العام.

فيه تلات حالات:

Underfitting: model بسيط جداً، مش قادر يمسك الـpattern. يعني بيعطي نتائج سيئة على training وtest.

Good fit: model معقد بشكل مناسب. بيعطي نتائج كويسة على الاتنين.

Overfitting: model معقد جداً، بيمسك الـnoise وخصوصية training data. بيعطي نتائج ممتازة على training، لكن سيئة على test.

الهدف هو generalisation: model يشتغل على observations جديدة من نفس المشكلة.

فيه طريقة واحدة تقدر تعرف بيها إذا كان في overfitting: قارن training score بـtest score. لو الـgap كبير، يبقى overfit.

والفرق بين الـtraining والـtest هو أهم overfitting check عندك — أهم من أي رقم لوحده."""

T[34] = """Training, validation, test — دي الـhonesty machinery. أي مشروع ML جدير بالثقة بيعمل الـsplit ده، وأي مشروع بيلعب فيهم، ما تثقش في أرقامه.

Training set (~60%): اللي model بيتعلم منه. الـmodel مسموح له يشوف الـlabels هنا، وهي اللي بيتعلم منها. طبيعي إنه هيعطي أداء عالي على الـtraining set — ده مش إنجاز.

Validation set (~20%): بنستخدمه أثناء تطوير model لاختيار settings — tree depth، عدد features، thresholds. الـvalidation set بنلمسه كتير، فهو مش clean scoreboard. هو بيساعدنا نختار، بس مش بيعطينا رقم نهائي honest.

Test set (~20%): بنفتحه مرة واحدة في النهاية. لو كل مرة نبص على test ونعدل model، test لم تعد test حقيقية — بقت validation set تانية.

وفي geology، الموضوع أصعب. لأننا محتاجين نفكر في spatial independence. ممكن تعمل train/validation/test ممتازة إحصائياً، لكنها كلها من نفس prospect. الـmodel هيشتغل على نفس البيئة الجيولوجية.

فقاعدة geology الرابعة: split in space, not at random. اعزل whole blocks، prospects، أو drill fences.

والسؤال المهم: independent بالنسبة لإيه؟ للصف؟ للhole؟ للprospect؟ للdistrict؟ كل مستوى له consequence مختلف."""

T[35] = """Confusion Matrix — دي الشريحة اللي بتعلمنا نفكر بـerrors بدل ما نختزل كل شيء في accuracy.

خلونا نبص على الـ4 boxes:

True Positive (TP): model قال mineralised، والواقع mineralised. ده اللي بنسميه success.

True Negative (TN): model قال barren، والواقع barren. ده كمان success.

False Positive (FP): model قال mineralised، لكن طلع barren. ده hole ضايعة، تكلفة بـمئات الآلاف.

False Negative (FN): model قال barren، لكن كان فيه mineralisation. ده اكتشاف فايت، فرصة ضايعة.

السؤال الحقيقي: أي واحد أسوأ؟

الإجابة: تعتمد على القرار.

لو كل positive معناها drill hole بـ400k دولار، فالـfalse positives لها cost كبير. لكن لو الهدف regional screening على مساحة كبيرة، ممكن نقبل positives أكثر في الأول علشان نقلل false negatives.

في deep diamond drilling على 500 متر، الـprecision مهم جداً — لأن كل hole غالية. في RC program على 50 متر، الـrecall أهم — لأن الـholes رخيصة، وانت مش عايز تفوّت حاجة.

الـmetric لازم تتربط بالـdecision، مش بالرقم اللي شكله أحسن في presentation."""

T[36] = """Precision وRecall — الاتنين بيدونا زوايا مختلفة، ولازم نستخدم الاتنين.

Precision: من كل الحالات اللي model قال عليها positive، كام واحدة فعلاً positive؟ يعني لو model قال "احفر هنا" على 100 target، قد إيه من التوصيات دي بتطلع مفيدة فعلاً؟ لو الـprecision 20%، يعني من كل 100 hole، 20 بس فيها mineralisation.

Recall: من كل الـreal positives الموجودة، model مسك كام واحدة؟ يعني قد إيه من الفرص الحقيقية قدرنا ما نفقدهاش؟ لو الـrecall 60%، يعني من كل 100 deposit حقيقية، الـmodel اكتشف 60 بس.

فيه trade-off دائماً بين الاتنين:

لو model طلع target واحد ممتاز، الـprecision ممكن يكون 100%، لكن الـrecall ضعيف جداً — هو مسك حاجة واحدة بس من المية.

ولو model طلع 1000 target، ممكن recall عالي، لكن field team مش هتقدر تتعامل مع كل ده، والـprecision هينزل.

فيه metric اسمه F1 score، بيدينا harmonic mean بين الاتنين. بس ده مفيد بس لو الـerrors الاتنين بتكلفة متساوية. وفي exploration، نادراً ما بتكون متساوية.

لازم نعرف تكلفة كل نوع من الأخطاء قبل ما نختار threshold."""

T[37] = """Accuracy ممكن تكون مضللة جداً — ومثال الشريحة دي هو الأحسن لتوضيح النقطة دي.

تخيل عندك 10,000 grid cell. من دول، 9,900 non-prospective، و100 prospective.

لو model بيقول كلهم non-prospective — يعني ببساطة مش بيعمل أي حاجة:

Accuracy = 9,900 / 10,000 = 99%.

الرقم ده شكل جميل، لكن الـmodel فشل في كل target مهم. الأرخص إنك تحفر صفر holes — يبقى كسبت 99% accuracy.

الشريحة دي بتقول: لما الـpositive class نادرة (كما في exploration)، الـaccuracy مش مؤشر مفيد أبداً. لازم نبص إلى confusion matrix، class balance، precision، وrecall.

والأهم: لازم نبص إلى spatial validation وسياق القرار. هل النتائج بتشتغل على ground جديد؟ هل بتحسن قرار الحفر؟

الرقم الكبير مش دايماً دليل على model مفيد. أحياناً، العكس.

حاجة أخيرة: لو حد جه يقولك "الـmodel بتاعنا accuracy 95%"، أول سؤال تسأله: إيه الـbase rate؟ يعني في الـground، كم في الـ100 فعلاً positive؟ لو الجواب 5%، فالـ95% مش مؤشر على حاجة."""

T[38] = """في geochemistry، الطريقة التقليدية هي threshold على عنصر واحد: Cu فوق X يبقى anomaly.

المشكلة إن الطريقة دي بتفقد كتير من المعلومات. أحياناً sample مش high بشكل واضح في أي عنصر منفرد، لكن combination زي Cu + Mo + As أو As + Sb بتبقى unusual جداً.

Multivariate methods بتلتقط patterns من combinations:

PCA — بيديك axes الرئيسية للـvariation.
Clustering — بيجمع samples المتشابهة.
Isolation forest — بيكتشف outliers.
Autoencoders — neural methods for anomaly detection.

لكن خليكم حذرين جداً: statistical anomaly ≠ exploration target.

ممكن يكون contamination، أو analytical problem، أو sampling effect، أو background geology عادي.

الـanomaly تتحول إلى target فقط لما الجيولوجي يعطيها mineral-system explanation ويقدر يقترح test يفرق بين التفسيرات.

قاعدة عملية: لما تشوف anomaly غريب، قبل ما تسميه target، اسأل: إيه اللي غير mineralisation ممكن يعمله؟ لو لقيت إجابة، اتعامل معاها. لو مالقيتش، اتعامل معاها كـtarget محتمل."""

T[39] = """Neural Networks وDeep Learning مش معناهم "AI أحسن". دي أداة، وزي أي أداة، عندها use cases محددة.

الفكرة الأساسية: network فيها layers من transformations بسيطة، ومع العمق (عدد الـlayers)، تقدر تتعلم representations أكثر تعقيداً. الـnetwork بتتعلم الـfeatures بنفسها، بدل ما إنت تقوله.

ده قوي جداً مع:
— Images: CNN بتتعلم textures وedges وshapes.
— Spectra: بتلتقط subtle absorption features.
— Waveforms: seismic، GPR، إشارات الزلازل.
— Text: NLP وlanguage models.

في core photos مثلاً، CNN ممكن تتعلم textures معقدة تساعد في lithology classification أو fracture detection. الأداء فيها ممكن يفوق human experts في المهام دي.

لكن التكلفة كبيرة:
— Thousands to millions of labelled examples.
— Real compute (GPUs).
— Serious loss of interpretability.
— Overfitting risk عالي.

القاعدة العملية: tabular geoscience data → trees and boosting. Images, spectra, waveforms, وtext → deep learning. اختيار الـfamily الغلط هو beginner's error شائع.

لو عندك 900-row assay table، deep learning مش تلقائياً أفضل. Tree-based models أو gradient boosting قد تكون أكثر ملاءمة، وأسرع، وأسهل في التفسير.

مثال: في مسابقات Kaggle على tabular data، الـgradient boosting (XGBoost, LightGBM) بتغلب neural networks في 90% من الحالات."""

T[40] = """Explainability — الشريحة دي بتتكلم عن الحاجة الأخيرة: model قال إن target score = 92. ليه؟

Explainability بتساعدنا نسأل: إيه variables اللي دفعت prediction؟

مثلاً top features كانت: Cu/Mo ratio (92)، magnetic destruction (81)، fault intersection (68)، distance to road (54)، cover thickness (39).

لو top features منطقية مع mineral system، ده يفتح باب hypothesis جديدة. الـCu/Mo ratio عالي معناها إحنا قربين من المركز. الـmagnetic destruction عالية معناها نطاق الـphyllic alteration. الـfault intersection عالية معناها plumbing كويس. كلها منطقية.

لكن لو "distance to road" هي أهم feature، لازم نقف. هل الـroads هي control على mineralisation؟ غالباً لا. ممكن الـmodel يكون اتعلم إن drilling history مركزة قرب الطرق. يعني الـmodel بيتنبأ بالـhuman behaviour، مش بالـgeology.

فـfeature importance مش proof of causation. هي أداة للتحقيق.

قاعدة: الـmodel لازم "يشهد" على الأسباب اللي يعتمد عليها. والجيولوجي لازم يفحص الشهادة دي.

لو الـtop features مش منطقية، ارفض الـmodel، مش تشرحها على إنها success."""

T[41] = """نقفل Module 04 بتلات أفكار أساسية.

أولاً: training performance مش كفاية. لازم generalisation. الـmodel اللي بيشتغل على training data بمستوى ممتاز، لكن بيفشل على test data، هو مش useful. الفرق بين الـtraining والـtest هو honesty check.

ثانياً: metrics لازم ترتبط بالقرار وبكلفة الأخطاء. مفيش metric واحدة اسمها الأفضل. Accuracy، precision، recall، F1، ROC-AUC — كل واحدة بتجاوب على سؤال مختلف. اختارها حسب القرار اللي بتحاول تدعمه.

ثالثاً: explainability مش رفاهية. لو model هيؤثر على قرار exploration، لازم نقدر نسأل هو اعتمد على إيه، وهل ده منطقي جيولوجياً. If you cannot explain it, you cannot defend it.

وبكده إحنا بنكون انتقلنا من: عندي data، إلى: عندي features، إلى: عندي model، إلى: هل أقدر أثق في prediction؟

وده يجهزنا للخطوة التالية: نشوف AI فعلياً عبر exploration value chain، من remote sensing إلى geochemistry وgeophysics وcore و3D modelling وtargeting. في الحقيقة، الـModule 04 هو الأساس اللي أي حد بيتكلم عن AI لازم يكون عنده."""

# ═══ Module 05 ═══
T[42] = """إحنا دلوقتي بنبدأ Act III، وهنحوّل الكلام النظري إلى exploration workflow حقيقي. من هنا لآخر الورشة، هنشوف الـAI بيشتغل إزاي في الممارسة العملية، مش بس في النظرية.

في كل محطة في الـvalue chain، هنثبت نفس الأربع أسئلة: إيه الـinput؟ إيه الـmethod؟ إيه الـoutput؟ وإيه الـhuman check المطلوب قبل القرار؟

الـAI مش محطة واحدة. هو طبقة بتدخل في مراحل مختلفة، وأنا عايزكم تخرجوا من هنا قادرين تحددوا في كل مرحلة: إيه اللي الـAI بيحسنه، وإيه اللي لسه محتاج عين الجيولوجي. لأن الفرق بين الاتنين هو اللي بيحدد فشل المشروع من نجاحه."""

T[43] = """بصوا على الـexploration value chain كلها مرة واحدة. من remote sensing → geochemistry → geophysics → core & drilling → 3D modelling → targeting. المراحل مترابطة، وأي خطأ في خطوة مبكرة بينتقل للخطوة اللي بعدها.

مثلاً: لو الـremote sensing map فيها false positives من playa deposits، واتعملت على أساسها soil grid، والـsoil grid طلعت anomalies من الـfalse positives دي، والـanomalies دي دخلت في prospectivity model، والـmodel طلع target، والـtarget اتحفر — خلصنا. ضيعنا hole على chain of errors من أول خطوة.

القيمة الحقيقية إن كل خطوة يكون لها:
— Input واضح ومحدد.
— Method مناسب للـinput.
— Output قابل للتحقق.
— Human check قبل ما نكمل للخطوة التالية.

دي الخريطة اللي هنمشي عليها لباقي اليوم. كل stop فيه نفس الهيكل: DATA IN → METHOD → OUTPUT → HUMAN CHECK."""

T[44] = """نبدأ بالـRemote Sensing — Stop 1. الفكرة الجيولوجية أولاً: المعادن والـalteration لها spectral responses، والـsensors تقدر تحول الفيزياء دي إلى خرائط على مساحة كبيرة.

الـdata in: ASTER، Sentinel-2، Landsat، WorldView-3، airborne hyperspectral. بالإضافة لـDEM للـtopographic correction وshadow masking.

الـmethod: band ratios → supervised classification → spectral unmixing. Random forest أو CNN للـalteration classes. Unsupervised clustering للـspectral domains اللي محدش عرّفها.

الـoutput: clay، iron-oxide، silica، وcarbonate alteration maps. Zoned argillic-phyllic-propylitic patterns، gossans، structural lineaments، وvegetation-stress proxies.

الـhuman check: field and spectral validation. ليه؟ لأن vegetation، salt crusts، dust، وshadows كلهم ممكن يقلدوا alteration signature.

مثال حقيقي: في arid range، الـband-ratio composite بيبان فيه argillic core بلون أحمر، وpropylitic halo بلون أخضر. لكن فيه برضه false positive في playa evaporite — الـspectra بتاعته شبيهة جداً بـclay. لو مشيت على الخريطة من غير ground-truth، هتضيع موسم على salt lake.

الـremote sensing هو أرخص كيلومتر مربع في exploration. لكن كمان هو الأسهل في الـover-interpretation."""

T[45] = """Stop 2 — Geochemistry. الحديث هنا عن multivariate anomaly detection وvectoring.

الـdata in: soil، stream sediment، rock chip، biogeochemical، lag surveys. بمئات آلاف العينات، و50+ عنصر لكل عينة. مع QA/QC records، detection limits، وlog-ratio transforms. تذكروا: assays هي compositional data — لازم CLR/ILR transforms.

الـmethod: PCA، clustering، isolation forest، autoencoders، RF regression. مع classic geostatistics للـcontinuity، وcompositional data analysis.

الـoutput: anomaly scores، element associations، vectors toward a centre. Separated background populations per regolith domain، وresidual maps بعد ما نشيل الـlithological background.

الـhuman check: regolith، contamination، support. الـanomaly هي deposit، ولا transported horizon، ولا fence line، ولا lab batch؟

الـbest-practice sequence مهم: domain أولاً، background per domain تانياً، anomaly تالتاً. لو تخطيت الخطوة الأولى، هتطلع خريطة جميلة للـregolith، مش للـmineralisation.

قاعدة عملية: أي geochemical anomaly مش هتعرف تفسرها بمنطق الـmineral system، ما تعتبرها target. هي observation، مش interpretation."""

T[46] = """Stop 3 — Geophysics. من inversion إلى interpretation.

الـdata in: magnetics، gravity، EM/AEM، IP، seismic، MT، downhole logs. مع petrophysical measurements على core علشان نربط physical properties بالـrock types.

الـmethod: ML-accelerated inversion، learned regularisation، classification of property models. Neural surrogates بتقدر تعمل approximate forward model في milliseconds، وclustering متعدد الخصائص في lithological domains.

الـoutput: 3D property volumes، automated lineament picks، litho-predicted blocks. Depth-to-basement surfaces، conductor picks، وprobability volumes.

الـhuman check: non-uniqueness never goes away. الـgeophysics inversion في طبيعتها غير unique — أكثر من earth model ممكن يفسر نفس البيانات. الـAI بيعمل inversion أسرع وأنعم، لكنه مش بيخلي الجواب unique.

مثال: TMI grid مع automated lineament extraction. الـmachine بيلاقي edges، لكن الجيولوجي هو اللي يقرر أي edges هي faults. فيه edge ممكن يكون من survey merge، مش من جيولوجيا.

القاعدة: machine-learned prior لسه prior. لو استخدمت prior، سمّيه."""

T[47] = """Stop 4 — Drilling & Core. Computer vision على core — ده أكتر application ناضج في الصناعة.

ليه؟ لأن البيانات structured (core trays بمواصفات ثابتة)، الـlabels موجودة (geologists log every interval)، والـverification سهل (بعينك).

الـdata in: core photography، hyperspectral scanning، downhole logs. الأغلى في exploration لكن الأغنى.

الـmethod: computer vision pipelines. Classification للـlithology، segmentation للـboundaries، detection للـfractures، regression للـRQD.

الـoutput: standardised image، depth-aligned colour-balanced، lithology classes، fracture picks، RQD measurements.

الـhuman check: review queue. الـmodel مش بيستبدل الـlogger. هو بيخلي الـlogger consistent across four geologists and fifteen years.

الفكرة: الهدف مش الاستبدال، الهدف الـconsistency والـspeed. الـmodel بياخد الحالات الواضحة، والجيولوجي بيركز على الحالات المشكوك فيها.

مثال: 1000 meter core interval. Logger واحد ياخد 3 أيام. الـmodel ياخد 3 ساعات، ويعمل consistent labels، والـlogger يراجع 200-meter الحالات الصعبة بس.

الـerror modes: wet vs dry differences، lighting differences، missing scale cards. كل دول بيبوظوا الـmodel. الحل: controlled capture."""

T[48] = """Stop 5 — 3D Modelling، Domaining، Resource Estimation.

الـimplicit modelling بالفعل استبدل hand-drawn sections. Radial basis functions بتعمل fit لـcontinuous field من logged contacts. ده standard practice دلوقتي — سريع، repeatable، وسهل نحدّثه لما hole جديدة تيجي.

الـML دلوقتي بيpush في interpretation وestimation steps beyond implicit modelling:

Auto-domaining: clustering composites by geochemistry، alteration، structure، لتحديد stationary domains. الـdomains دي لازم تتفق مع genetic logic، مش بس statistical.

Grade estimation: gradient boosting ممكن يغلب kriging في حالات relationships non-linear وmultivariate — لكن بيفقد الـexplicit variogram والـunbiasedness guarantees.

Uncertainty: simulation مش single answer. Multiple equally-plausible realisations بتدي probability distribution per block. ده essential للـclassification وللـhonest risk statements.

الـhuman check: reporting codes (JORC، NI 43-101، PERC) بتطلب Competent Person ياخد المسؤولية. مفيش model بيوقع technical report — فيه إنسان اسمه مكتوب.

الـfield note: كل ما الـmodels تنتشر، الطلب على الناس اللي تعرف تاخد مسؤولية بيزيد، مش بيقل."""

T[49] = """Stop 6 مبكر — Data Governance. الشريحة دي أهم شريحة في الـmodule كله.

الشركات اللي بتنجح في AI مش اللي عندها أذكى algorithms. هي اللي بياناتها قابلة للاكتشاف، موثوقة، قابلة للتكرار، ومصرح باستخدامها.

أربع pillars:

أولاً: Single source of truth. Database واحدة، مش 40 spreadsheet. مع enforced codes وunits. كل model، plot، report بيقرأ منها. الـexports disposable؛ الـdatabase هو الـasset.

ثانياً: Lineage. كل رقم traceable لsample. Lab batch، method، detection limit، date، مين لمسه، أي transform اتطبق. من غير lineage، مش تقدر تدافع عن نتيجة، ولا تعيدها بعد سنتين.

ثالثاً: Reproducibility. Scripts وversion control، مش manual clicks. Notebook + recorded data version = تقدر تعيد نفس الخريطة. "عدت الخطوات في Excel وطلعت إجابة مختلفة" — دي مش position مهنية.

رابعاً: Permission & Confidentiality. Unpublished assays، tenure، heritage information — كلهم لهم disclosure، licensing، وIndigenous data obligations. لو لصقت بيانات في public AI tool، دي disclosure event، مش shortcut.

الـfield note: graduate يقدر يبني ويوثق database موثوق، هو أكثر employable من واحد يقدر يسمي 10 algorithms. ده least glamorous، most bankable skill in the room."""

T[50] = """الشريحة دي بتوضح حاجة مهمة: AI في exploration مش conference theory. فيه أمثلة حقيقية منشورة.

KoBold Metals: venture-backed explorer، منصة اسمها Terrain بدمج geological، geophysical، geochemical layers مع ML لترتيب targets. اكتشاف Mingomba في Zambia اتبنى على AI-assisted target generation — لكن discovery hole كان قرار جيولوجي.

Earth AI: junior أسترالي، بينشر drill results مباشرة مقابل AI-ranked targets، عبر commodities متعددة. ده حالات نادرة في إن الـmodel pick والنتيجة كلاهما public وcheckable.

Government open-data programmes: Geoscience Australia "Exploring for the Future"، USGS — بينشروا continent-scale magnetics، gravity، geochemistry، وmineral potential maps بتاعتهم. الشركات بتستخدمها كـbaseline.

Major-company data science teams: BHP، Rio Tinto، Newmont، وغيرهم عندهم in-house geoscience data teams. الشغل مش dramatic — core-scanning automation، geophysical inversion speed-ups، drill database governance. ده "plumbing work"، مش headline-grabbing AI discoveries.

الـfield note: مفيش واحدة من الأمثلة دي استبدلت geologist. كل public case study لسه بسمي human اللي اتاخد قرار targeting ووقع على drill programme.

'The model said so' is never a reason."""

T[51] = """Prospectivity Mapping — ده الـflagship application، وأكتر واحد معرض لسوء الاستخدام. لازم نفصله كويس.

خمس خطوات:

أولاً: Write the mineral system model first. Source، transport، trap، deposition، preservation. لو مش قادر تسمي ore-forming process، مفيش algorithm هييجي ينقذك.

ثانياً: Translate each ingredient into a mappable proxy. Fertile intrusion → geochemical index. Crustal-scale plumbing → gravity gradient. Trap → fault intersection density. الخطوة دي geology صافي.

ثالثاً: Choose knowledge-driven or data-driven. لو عندك few أو صفر known deposits → weights of a geologist (fuzzy logic، WofE). لو عندك enough training points → random forest، boosting، أو PU learning.

رابعاً: Validate spatially and honestly. Leave-one-deposit-out، success-rate curves، وbase rate معلن. Report area committed per hit، مش AUC بس.

خامساً: Rank targets with a geologist in the loop. Score + depth + access + tenure + drillability. الـmodel يرتب candidates؛ الفريق يتخذ قرار الحفر.

القاعدة: prospectivity map هي statement of a hypothesis عن mineral system. حاكمها زي ما تحكم على أي hypothesis: بما تنبأت به قبل ما تحفر.

مش treasure map."""

T[52] = """دي activity. المطلوب مش إننا نختار إجابة تبدو أكثر AI sophistication. المطلوب الإجابة اللي نقدر ندافع عنها في technical meeting.

خلونا نمشي على الأربع أسئلة واحدة واحدة:

السؤال الأول: junior explorer، 400 km² greenfields، no drill holes، regional magnetics وgeochemistry. أي approach مناسب؟
الإجابة الصحيحة: Knowledge-driven prospectivity (fuzzy logic / WofE) من mineral system model. ليه؟ لأن مفيش local positives. Supervised RF من قارة تانية غلط — different metallogenic province. Deep NN على raw grids غلط — no labels، no volume. k-means على magnetics لوحدها غلط — بيجاوب "إيه الشبه؟" مش "وين prospective؟".

السؤال التاني: lithology model مع accuracy 97% من random interval split. أول سؤال؟
الإجابة: Were test intervals spatially separated from training intervals? Random row splits على downhole data بتعمل leakage — this is the #1 cause of fantasy accuracy.

السؤال التالت: إيه الـAI application الناضج فعلاً في exploration؟
الإجابة: Automated RQD وfracture counting من core imagery. Well-posed vision task، abundant labels، verifiable by eye.

السؤال الرابع: multi-element soil assays compositional. ليه مهم قبل modelling؟
الإجابة: لأن القيم بتجمع لـconstant، الـcorrelations بتتشوه، ومحتاجة log-ratio transforms. CLR/ILR transforms بترجع correlation structure سليمة.

A question you get wrong is more useful than one you get right. Treat it as a signal to re-read."""

# ═══ Module 06 ═══
T[53] = """دلوقتي نبدأ Case Study كاملة: Project Solstice. ده synthetic porphyry Cu-Au district، 480 km²، متغطي بـ40m من post-mineral gravel. أنت graduate geologist على targeting team، و20 من الـ30 دقيقة دول بتاعتك.

الـobjectives:
— Follow one exploration problem من data compilation لـdrill decision.
— Produce وdefend ranking بتاعك قبل ما تشوف ranking الـmodel.
— Identify أي model output هترفضه، وليه.

الـcase study ده هو الجزء العملي اللي هيختبر كل اللي اتعلمناه في Modules 1-5. هنمشي على نفس الخطوات: mineral system → data audit → features → ranking → decision → outcome."""

T[54] = """أول حاجة قبل أي data: نحدد mineral system. إحنا بندور على إيه، وإيه اللي هيسيب وراه؟

Target: Calc-alkaline porphyry Cu-Au على عمق 300-600 متر، في Late Cretaceous arc setting، dioritic-to-granodioritic stocks على crustal-scale structure.

Fingerprints:
— Zoned alteration: potassic core → phyllic → propylitic.
— Magnetic low-in-high: destruction of magnetite جوّه magnetic high.
— Sulphide halo: disseminated pyrite بيطلع chargeability anomaly.

Pathfinders:
— Cu-Mo-Au مع As-Sb-Zn distal signature.
— Cu/Mo ratio بيوجه نحو المركز.
— Zn/Cu بتزيد للخارج — direction، مش intensity بس.

Problem:
— 40m من transported cover. Surface geochemistry diluted وdisplaced. Nothing outcrops. كل حاجة لازم تتعرف من indirect evidence.

الـthree known features:
— A: Historic prospect مع 3 shallow holes، أفضل نتيجة 0.31% Cu.
— B: Untested magnetic low على main structure.
— C: Coincident IP chargeability وCu-in-soil anomaly."""

T[55] = """دلوقتي نعمل data inventory صريح. ده هو اللي بيمشي للـtechnical committee، وعمود الـlast هو اللي بيحدد الـmodel مسموح يعمل إيه.

Airborne magnetics: 100% coverage، 200m lines، 2019. Fitness: Good — single survey، consistent height.

Gravity: 1km stations، 60% من area، 1994+2021. Fitness: Two datums، needs levelling؛ gap in the north-east. يعني مش consistent.

IP / resistivity: 6 lines، 4% من area، 2022. Fitness: Excellent quality لكن tiny coverage — مش ممكن يكون model input في كل مكان.

Soil geochemistry: 400×100m grid، 70%، من 2008-2021. Fitness: Three labs، two detection limits، no umpire re-assays. ده أهم quality trap.

ASTER alteration: 100%، 2004. Fitness: Compromised by cover، useful only on the ranges.

Drill holes: 17 hole، كلهم قريب من prospect A، 1996-2014. Fitness: Severe sampling bias — ده الـtraining data الوحيد.

Structural interpretation: 100%، 2023. Fitness: Interpretation مش measurement، one author، one model.

الـfield note: 17 hole، 16 منهم على بعد 900م من بعض. احفظوا الفكرة دي — Module 07 هيفتحها تاني."""

T[56] = """دلوقتي نحول الـevidence layers إلى features. 12 feature على 100×100m grid. كل feature مرتبطة بـmineral-system ingredient، والجدول ده هو اللي يخلي الـmodel defensible.

Fertility & source:
— Gravity residual (buried intrusion proxy).
— Magnetic susceptibility contrast.
— ASTER K-alteration index حيث الـcover يسمح.

Plumbing & trap:
— Distance to interpreted crustal structure.
— Fault intersection density.
— Curvature of interpreted basement surface.

Alteration & sulphide:
— Magnetic low within regional high (magnetite destruction).
— IP chargeability where surveyed.
— Soil Cu/Mo ratio.
— Zn/Cu vector.

Cover correction:
— Modelled cover thickness from AEM بيستخدم لـnormalise soil geochemistry. من غيرها، الـmodel هيتعلم cover thickness، مش mineralisation.

Label construction:
— Positives: intervals >0.2% Cu من الـ17 hole.
— Negatives: فقط holes اللي test a target وفشلت — مش unexplored ground.

Validation design:
— Leave-one-prospect-out. مع prospect cluster واحدة بس، نعترف إن الـmodel هو hypothesis ranker، مش validated predictor. بنقول ده upfront.

كل خطوة في الـ12 feature دي هي geological reasoning مكتوبة."""

T[57] = """دلوقتي دوركم. قبل ما نشوف model، أنتم ترتبوا targets. اعملوا ranking على أساس evidence، confidence، وdrill feasibility، وبعدين قارنوا ترتيبكم بترتيب النموذج.

خمس candidate targets:

A — Known low-grade shell. Dense historic drilling. معروف إنه فيه mineralisation، لكن low-grade. مين هيديه priority؟ الـmodel هيعمله high لأنه هو نفسه training data.

B — Magnetic low-in-high + fault intersection. Untested. الجيولوجيا بتقول إنه promising، لكن مفيش drill holes. الـmodel مش هيشوفه عالي لأنه مش في training data.

C — IP chargeability + Cu anomaly. Moderate cover. Clear geophysical signature، لكن مش متأكد من السبب.

D — Strong soil anomaly من lab batch مشكوك فيه. الـmodel هيشوفه عالي، لكن لو راجعنا الـQA/QC، هنلاقي batch فيها standard drift.

E — Thick cover، weak inputs، favourable structure. Low score في الـmodel، لكن ممكن يكون "no information" مش "no deposit".

الترتيب المهني المتوقع: B → C → A → E → D. الـmodel على الأغلب هيعمل ترتيب مختلف.

TAKEAWAY: Where you and the model agree، تكسب confidence رخيص. Where you disagree هو الجزء المهم — ده الـreal deliverable."""

T[58] = """هنا نشوف القرار الحقيقي للـtargeting committee. الـmodel كان input واحد من ستة.

Accepted from the model:

Target B اترفع من 4th لـ1st. ليه؟ combination "magnetic-low-within-high + structural intersection" اترتب عالي، ومحدش من الفريق كان ربط الـtwo layers دي. الـmodel عمل connection مش حد عمله.

900 hectares من northwest Licence اتعملهم deprioritise، وده وفّر soil programme كامل.

Cu/Mo ratio اتأكد إنه أقوى geochemical feature — consistent مع porphyry model. فإحنا نثق في الـmechanism، مش بس الـscore.

Overruled by geologists:

Target 2 اترفض رغم إنه score عالي (ثاني أعلى). ليه؟ الـhigh score جاء بالكامل من soil samples ترجع لـsingle 2008 lab batch فيها drifting standard. ده false confidence.

الـmodel's low score لـTarget E اتجاهل. الـtarget تحت thick cover، كل input layers ضعيفة، فـlow score معناها "no information"، مش "no deposit". ده فرق جوهري.

Ranking مش مستخدم لتحديد hole depth أو orientation. الـmodel ملهوش concept عن drill geometry أو ore-body plunge.

The model said so is never a reason. 'The model ranked it highly، the mechanism is consistent with our system model، and the inputs are trustworthy there' — ده reason."""

T[59] = """بعد أربع holes، ده الـhonest scorecard. لاحظوا إن أهم contribution للـmodel كان مش top pick بتاعه.

Hole 1 — Target B: 0.48% Cu، 0.3 g/t Au over 180m من 410m. Potassic alteration مع phyllic overprint. الـlayer combination اللي الـmodel رفعه كان real، ومحدش في الفريق كان عمل priority عليه. Success.

Hole 2 — Target C: Barren propylitic alteration، weak pyrite. Distal halo، wrong side of the system. مش failure — هو constrain الـzoning، وعمل re-vector للـnext hole.

Hole 3 — Target A: Confirmed known low-grade shell فقط. الـhistoric prospect كان model's second pick، بالكامل لأنه احتوى كل الـtraining data. ده predictable artefact of sampling bias. تجربة أكدت إن الـmodel شايف نفسه.

The real win: Ground eliminated with defensible reasoning. Half the Licence اتعملها deprioritise على criteria documented وreproducible. القرار ده auditable next year لما geologist جديد يورث المشروع.

درس عملي: الـmodel لم يكتشف deposit وحده. هو قرأ 40,000 grid cell عبر 12 layer بدون ما يتعب، وقال للجيولوجي أي ثلاث يستحقوا نظرة جدية. الجيولوجي عمل الباقي."""

T[60] = """الخلاصة: النموذج لم يكتشف deposit وحده. هو قرأ 40,000 grid cell عبر 12 layer بدون ما يتعب، وقال للجيولوجي أي تلات يستحقوا نظرة جدية. الجيولوجي عمل الباقي.

الـmodel مش بديل. هو مساعد. القيمة الحقيقية لما الجيولوجي يعرف يستخدمه بدون ما يفقد المسؤولية.

القيمة الحقيقية في Solstice ما كانتش في الـhit hole — كانت في الـ900 hectares اللي اتعملها deprioritise. توفير soil programme كامل، بناءً على reasoning documented وقابل للتكرار.

ده الجزء اللي مش بيتحط في headline. الأسف إن قيمة الـAI في الـexploration غالباً في اللي مش بتحفره، مش في اللي بتحفره."""

# ═══ Module 07 ═══
T[61] = """دلوقتي Act IV: الحكم المهني. كل failure هنا ظهر في modules السابقة؛ الآن فقط هنسميه ونحوله لأسئلة تقدر تستخدمها في اجتماع فني.

مفيش حاجة جديدة في الـmodule ده. هو فقط تنظيم للـfailure modes اللي شوفناها. الهدف: تخرجوا بلغة تسمح لكم ترفضوا نتيجة بطريقة مهنية، مش personal.

فيه أهداف تلاتة:
— تسمية خمس failure modes والـevidence اللي يكشف كل واحدة.
— الأربع أسئلة اللي تعمل interrogate لأي model result.
— إزاي ترفض نتيجة politely وtechnically."""

T[62] = """خلونا نسمي failure modes بوضوح، وربط كل واحدة بـwhere you saw it في الورشة النهاردة:

أولاً: Self-selection bias. Where you saw it: الـopening poll — القاعة دي اختارت geology. Question: Who was actually included in the sample? الـsample مش random من السكان الأصلي، هي self-selected.

ثانياً: Sampling bias. Where: Solstice's 17 holes، 16 في cluster واحدة. Question: Does this predict geology, or where we already drilled? الـmodel بيتنبأ بتاريخ الحفر، مش بالجيولوجيا.

ثالثاً: Spatial data leakage. Where: 0.96 random split vs 0.71 spatial split. Question: How was the test set separated in space? لو الـsplit مش spatial، الأرقام كلها كذب.

رابعاً: Overfitting. Where: الـcomplexity slider والـjagged boundary. Question: What is the score on ground the model never saw? الـtraining score مش مؤشر.

خامساً: False confidence. Where: Solstice Target 2 والـdrifting lab batch. Question: Is the model confident, or just consistent with bad input? الثقة ممكن تكون نتيجة consistency مش accuracy.

كل واحدة من دي شوفناها live. الآن سميناها، وعندنا سؤال واحد يكشفها."""

T[63] = """دلوقتي الـfour more — failures اللي تنجى حتى مع data نظيفة وsplit جيد. لكن لسه بتبوظ المشروع.

أولاً: Extrapolation. Model اتدرب على 0-200m depth، بيسعد score لـ900m target. مفيش mechanism يخليه يقول "I have never seen this". Plot input ranges. ولو الـmodel بيشتغل بره الـtraining envelope، ارفضه.

ثانياً: Concept drift. الأرض اتغيرت، الـmodel لأ. New lab، new sensor، new terrane، new logging standard. Model السنة اللي فاتت بقى systematic error بتاع السنة دي.

ثالثاً: Proxy features. Learning exploration history. Distance to road، survey year، tenement boundary. Predictive، meaningless، ومحرج لما reviewer ياخد باله.

رابعاً: Automation bias. البشر بيخدعوا بالرقم. Heatmap بلون رامب فاقع بيحسسك أكثر authoritative من حجة جيولوجي. ودي best-documented risk في الـAI-assisted exploration — وهي مش عن الـmodel، هي عن البشر.

كل واحدة من دول بتشتغل حتى لو كل حاجة تانية تمام. فلازم تكون في دماغك."""

T[64] = """دي activity. عندنا أربع results، كل واحدة معروضة بثقة كاملة. المطلوب تلاقي الـflaw — واحد بس منهم fine.

Result 1: 97% lithology accuracy من random interval split.
الـflaw: Spatial data leakage. Random row split على downhole data بيحط الـintervals من نفس الـhole في training وtest. الـmodel بيحفظ location.

Result 2: Top prospectivity driver: distance to the nearest road.
الـflaw: Proxy feature. Roads مش metallogenic control. الـmodel اتعلم إن الحفر تاريخياً بتركز قرب الطرق.

Result 3: Low score beneath 150m cover.
الـflaw: Interpretation error. Low score في منطقة بلا data معناها "no information"، مش "barren". الـgeologist قرأها صح.

Result 4: Leave-one-prospect-out score of 0.71, with uncertainty map.
الـflaw: مفيش. ده بالظبط اللي عايزينه. Lower score، spatial split، uncertainty map. ده honest result.

naming the failure is the skill. لما تعرف تسمي الـflaw بالظبط، تعرف تمنعه في المستقبل. vague sense إن فيه حاجة غلط مش كفاية."""

T[65] = """دي أهم checklist في الورشة. اطبعوها، احفظوها، استخدموها في كل model result تُعرض عليكم.

السؤال الأول: What were the labels, and who made them?
— أي holes اتحسبت positive؟
— مين عمل logging؟ في أي سنة؟ تحت أي standard؟
— هل unexplored cells اتعاملت كـnegatives؟ (لو أيوه، مشكلة كبيرة)

السؤال التاني: How was the test set separated in space?
— Random rows، أو whole prospects/blocks؟
— لو الـsplit مش spatial، كل الأرقام مش معناها حاجة على ground جديدة.

السؤال التالت: Which features drive it, and are they geological?
— اطلب importances.
— لو top drivers هي acquisition أو access artefacts، الـmodel لقى الـhistory، مش الـmineral system.

السؤال الرابع: What does the model say about ground it has no data on?
— Low score تحت cover thick معناها "no information"، مش "barren".
— اطلب uncertainty map وdata-density map مع الـprediction.

السؤال الخامس (softer): What would have to be true for this to be wrong?
— لو مفيش حد في الفريق يقدر يجاوب، مفيش حد stress-tested.

الأربع أسئلة دول بيشتغلوا سواء كنت فاهم algorithm أو لأ. مش محتاج تكون data scientist علشان تستخدمهم."""

T[66] = """الشريحة دي skill مهني: إزاي تعرض model result، وإزاي ترفض واحد.

أربع حاجات لازم تكون على الـslide:

أولاً: Show the score next to the data density. مفيش prediction map لوحده. Side by side: score، وكمية evidence الموجودة في كل cell. Low score تحت thick cover بتتقرأ كـ"untested"، مش "barren".

ثانياً: State the validation design in one sentence. "Whole prospects withheld; 0.71 on unseen ground" بتكسب ثقة. رقم واحد بدون split described بيدير القاعة، مش بيبهجها.

ثالثاً: Give a ranking, plus what would change it. "B ahead of C on the magnetite-destruction signature; twenty infill soils on the same line would reverse that." القرار-makers بيشتروا next steps، مش certainty.

رابعاً: Refuse with evidence, not instinct. "I am not comfortable" بتخسر. "Its score rests on the 2008 soil batch whose standard drifted 18%; re-assay fifty pulps and I will support it" بتكسب، وبتكلف الشركة صفر.

النقطة الأخيرة: Under JORC، NI 43-101، PERC — named Competent Person بياخد المسؤولية، أياً كان اللي أنتج الـresult. Accountability cannot be delegated to software."""

T[67] = """الـmodel أبداً مش غلط على شروطه. هو faithfully يعيد إنتاج الـpatterns اللي انت أعطيتهاله. كل حاجة غلط بتحصل في الفجوة بين اللي انت أعطيته والـEarth الحقيقي.

تخيل المثال ده: الـmodel اتدرب على soil geochemistry في منطقة معينة. لما تطبقه على منطقة تانية، هو بيفترض إن نفس الـcorrelations تنطبق. لو المنطقة التانية فيها regolith مختلف، الـcorrelations بتتكسر. الـmodel مش هيقولك إن الفرضية دي اتكسرت — هو بيعطيك نتيجة بثقة.

الـsticky takeaway: A model is never wrong on its own terms — it faithfully reproduces the patterns in what it was given. Everything that goes wrong goes wrong in the gap between what it was given and what the Earth is.

skepticism هو part of the job، مش عيب. الـgeologist اللي بيثق في كل حاجة بيخرج من مكانه بعد فترة."""

# ═══ Module 08 ═══
T[68] = """آخر Act عن الأدوات والمستقبل المهني. Nobody in this room needs to become a data scientist. كل واحد فيكم محتاج يبقى geologist الـdata scientist مش يقدر يضحك عليه — ومش يقدر يشتغل من غيره.

فيه تلات أهداف:
— تسمية الأدوات المستخدمة فعلاً في الصناعة.
— وصف التحول في دور الجيولوجي بشكل concretely.
— تخرجوا بخطوة عملية واحدة.

الـsession قصيرة (10 دقايق)، لكنها عملياً أهم حاجة في الورشة. لأنها بتحدد إيه اللي هتعمله بكرة."""

T[69] = """مش لازم تتعلم كل software. اللي محتاج تعرفه: إيه الفئة اللي كل أداة بتقع فيها، وإيه المفهوم الأساسي بتاعها.

GIS & spatial: QGIS، ArcGIS Pro، GeoPandas. Non-negotiable. اتعلم QGIS بشكل احترافي — مجاني ومقبول في الصناعة.

3D geology & resource: Leapfrog، Vulcan، Micromine، Datamine، Surpac. افهم implicit modelling concepts. هتتدرب على اللي شركتك بتملكه.

Geophysics: Oasis montaj، VOXI، SimPEG، UBC-GIF. افهم إيه inversion، وليه غير unique.

Geochemistry: ioGAS، CoDaPack، PyRoll. Log-ratio transforms وmulti-element population analysis.

Core & hyperspectral: Corescan، HyLogger، Minalyze، Datarock. Automated logging موجود، وبيطلع data محتاجة validation.

Data science: Python، pandas، scikit-learn، Jupyter. اعرف تقرأ notebook، تغير parameter، تديره بثقة.

Prospectivity platforms: ArcSDM، WofE toolkits، in-house ML stacks. Knowledge-driven وdata-driven بيتناسبوا مع مستويات maturity مختلفة.

Generative AI assistants: ChatGPT، Claude، Copilot. Excellent للـcode، summaries، literature. Never a source of geological fact.

Cloud & MLOps: Databricks، AWS/Azure/GCP ML، MLflow. مش هتبني ده، لكن ممكن تغذيه.

Databases هي الأهم في الممارسة. Clean documented version-controlled database — بالفعل ahead من معظم الصناعة."""

T[70] = """Generative AI مفيد كـfast junior assistant. لكنه مش authority. وده الفرق بين نجاح مهني وكارثة مهنية.

Genuinely useful:
— Writing and debugging Python اللي ما اتعلمتوش — بيشرح أثناء الشغل.
— Summarising 300-page report لـsearchable structure — مع cite للصفحة اللي لازم تقرأها بنفسك.
— Extracting structured data من unstructured legacy text — assay tables في PDFs scanned.
— Drafting method sections، memos، QA/QC documentation — اللي إنت بعد كده تصححه.
— Explaining unfamiliar method بأي depth تطلبه.

Do not do this:
— Accept geological fact، reference، grade، أو coordinate بدون verification. Fabrication بتبقى fluent و confident.
— Paste confidential project data في public tool. ده disclosure event.
— Use it to generate prospectivity opinion. مفيش access لبياناتك، ومفيش spatial reasoning.
— Present its writing كـinterpretation بتاعتك في technical report. Named human accountable.
— Skip learning the fundamentals لأن الأداة بتجاوب بسرعة.

الـprofessional question مش "هل AI كتب ده؟" السؤال: "هل أقدر أوضح الـevidence، checks، وaccountable human judgement behind it؟"."""

T[71] = """لو استخدمت LLM في شغلك، استخدم workflow واضح. الأربع gates:

Draft with a bounded task. اسأل عن table cleanup، first-pass Python function، أو plain-language summary. حدد الوحدات، الجمهور، output format. أبداً ما تلصق confidential assays، coordinates، targets unpublished في public tool.

Verify against primary evidence. افتح التقرير الأصلي، dataset، أو paper. تحقق من كل number، coordinate، reference، assumption، unit. A fluent answer is not evidence. Citation مش proof إن الـsource بيقول اللي الأداة بتقول إنه بيقوله.

Cite what survives. سجل الـsource، page/row، date accessed، transformation، وtool involvement. افصل الـgenerated text عن تفسيرك الجيولوجي — علشان حد تاني يقدر reproduce الـchain.

Human review and escalation. Competent geologist يراجع أي حاجة بتأثر على targeting، safety، resource reporting، regulatory work، أو external communication. لو فيه uncertainty، وقف، اطلب الـmissing evidence، وescalate.

Field note: The professional question is not 'Did AI write this?' It is 'Can I show the evidence، checks، and accountable human judgement behind it؟'."""

T[72] = """Realistic skills ladder — كل step بيكمل خبرتك الجيولوجية، مش بينافسها. Steps واحد واتنين بالفعل بيحطوك ahead of most graduates.

1. Spreadsheet and data discipline. One row per observation، no colour-coding as data، no merged cells، documented units، data dictionary. Unglamorous، worth more than any algorithm.

2. QGIS to a working standard. Projections، joins، raster sampling، symbology، print layouts. This is the language of exploration data.

3. Python literacy, not fluency. اقرأ notebook، غيّر parameter، plot بياناتك بـpandas وmatplotlib. Two weekends بيوصلوك.

4. Statistics that matter for geology. Distributions، log-normality، compositional data، correlation vs causation، variograms، spatial dependence.

5. One supervised model, start to finish. Take a public drill database، predict something، split spatially، and be honest about the score. The learning في الـhonesty.

6. Communication and scepticism. اشرح model لـboard ولـdriller. ارفض result بأسباب تقنية. ده skill اللي بيخليك تدخل الـroom.

الـordering هو المهم. كل step بيبني على اللي قبله."""

T[73] = """الجمع بين geology وdata بيفتح أدوار كتير، وكلها بتدفع للـcombination، مش لأي half.

Exploration geologist + data: لسه field-based، لسه logging — لكن الشخص اللي بيهيكل data، يشغل QA/QC، ويطلع target-ranking اللي الفريق بيتجادل عليه.

Geodata scientist: Translator بين rocks وcode. قاعد في modelling team، بيتكلم اللغتين، والسبب إن inputs الـmodel منطقية جيولوجياً. Short supply حالياً.

Geophysicist / modeller: Inversion، integration، uncertainty. Physics + computation. ML-accelerated inversion وmulti-property domaining active research areas.

Technical services / CP: Governance and accountability. Resource classification، reporting codes، audit trails. As models spread، الطلب على الناس اللي تعرف sign off بيزيد.

Data / MLOps engineer: Keeps pipeline honest and running. Automated ingestion، validation، retraining pipelines. Geology fluency هو اللي بيفرق بين good one وgeneric data engineer.

Remote sensing / spectral geologist: Owns satellite-to-ground-truth loop. Hyperspectral pipelines، field campaigns. High demand as constellations cheaper.

كل الـroles دي محتاجة geology + data، مش geology بدل data، ولا data بدل geology."""

T[74] = """بدل خطة تعلم ضخمة، اختار خطوة واحدة هذا الأسبوع وخلصها. A single finished small thing beats a course you abandon in week three.

فيه أربع اختيارات:

Download a real public dataset. Geoscience Australia، USGS Mineral Resources Data System، Natural Resources Canada، أو national survey بتاعك. Drill holes، geochemistry، geophysical grids كلها free. افتح واحد في QGIS واعمل map.

Reproduce one figure from today. Take public geochemistry table، compute Cu/Mo ratio، plot it، cluster it. Two hours، ومش هتنسى معنى feature.

Read one applied paper critically. Find published prospectivity study، شغل عليها الأربع أسئلة من Module 07. اكتب paragraph على اللي كنت هطلبه.

Ask the four questions out loud. Next time anyone shows you a model — في lecture، webinar، أو job interview — اسأل عن labels والـspatial split. Watch what happens.

Field note: Bring the result to your supervisor. Being the graduate who turned up with a reproducible map is a career event، مش homework exercise."""

T[75] = """دي vocabulary contract. كل term اتكلمنا عنه النهاردة، بمعناه الـplain English اللي اتفقنا عليه.

Algorithm: Procedure قابل للتكرار لتحويل inputs لـoutputs.
Machine learning: Methods بتتعلم patterns من examples بدل ما تستقبل كل قاعدة صراحة.
Feature: رقم مسموح للـmodel يشوفه.
Training set: Examples المستخدمة لتـfit الـmodel.
Artificial intelligence: العائلة العريضة من computer systems اللي بتأدي مهام مرتبطة بالذكاء البشري.
Deep learning: ML باستخدام layered neural networks، خصوصاً مع images، spectra، signals، text.
Label: الإجابة المعروفة اللي بتستخدم لتدريب أو اختبار supervised model.
Validation set: Examples اللي بتستخدم لاختيار model settings قبل الـfinal test.

الـglossary مش للحفظ. هو lookup. ارجع له لما تحتاج."""

T[76] = """نقفل الورشة بالتحول الأساسي.

You cannot build a model after five hours, and nobody expected you to. لكن إنت دلوقتي تقدر تسأل:

— Who made the labels?
— How was the test set split in space?
— Which features drive the answer؟
— What does the model know about ground it has never seen؟

That is the job.

مش محتاج تكون data scientist. محتاج تكون الجيولوجي اللي الـdata scientist مش يقدر يضحك عليه، ومش يقدر يشتغل من غيره.

لو خرجت من هنا بأربع أسئلة دول بس، الورشة نجحت. اسألهم في كل webinar، كل technical meeting، كل interview. Watch what happens.

شكراً — questions؟"""

# ═════════════════════════════════════════════════════════════════════════════
# QUESTIONS — all 76 slides
# ═════════════════════════════════════════════════════════════════════════════
QUESTIONS = {
    1:  "إيه الفرق بين model output وبين القرار الجيولوجي النهائي؟",
    2:  "إيه اللي يخلي خبرتك كمهندس بيانات مفيدة للجيولوجي في الحقل؟",
    3:  "أي Act في رأيك هيبقى الأهم لتطبيقك بعد الورشة؟",
    4:  "إيه الافتراض اللي داخل بيه القاعة النهارده، وهل ممكن يتغير؟",
    5:  "مين فيكم عمل classification في الحقل من غير ما يسميها ML؟",
    6:  "إيه اللي اتغير في exploration في آخر عشر سنين؟",
    7:  "ليه الـeasy discoveries خلصت؟ وإيه البديل؟",
    8:  "هل الـdata deluge حقيقية في شغلكم؟ إزاي؟",
    9:  "إمتى rule بسيطة تكون أفضل مهنياً من ML model؟",
    10: "فين بالظبط LLM ممكن يفيد exploration، وفين لا؟",
    11: "إيه نوع التعلم المناسب لـgreenfields بلا labels؟",
    12: "إيه أكبر misconception عن AI في exploration؟",
    13: "إيه الافتراضات المخفية في random split؟",
    14: "إزاي الجيولوجي مسؤولية أكبر مع AI مش أقل؟",
    15: "إيه الفرق بين data shape وdata size؟",
    16: "إيه أسوأ خطأ تعمله لو بدأت بـalgorithm قبل data shape؟",
    17: "أي dataset في inventory بتاعكم أخطر من اللي يبان؟",
    18: "إيه الفرق بين precision وaccuracy في QA/QC؟",
    19: "إيه الـ7 مشاكل في الجدول؟ سمي كل واحدة.",
    20: "ليه below detection limit ≠ zero؟ وإيه البديل؟",
    21: "إيه الفرق بين spatial autocorrelation وindependence الإحصائية؟",
    22: "إيه قاعدة واحدة هتاخدها من Module 02؟",
    23: "إيه الفرق بين الـmineral system والـmodel بتاعه؟",
    24: "إيه أهم سطرين في الـone-page brief؟",
    25: "ليه algorithm جاء متأخر في الـpipeline؟",
    26: "إيه الفرق بين feature وcolumn عادي؟",
    27: "إيه feature تعتقد إنها كانت سبب في false positive؟",
    28: "ليه training data مش عينة عشوائية من الـcrust؟",
    29: "إيه الفرق بين 0.96 random split و0.71 spatial split؟",
    30: "إيه الهدف من Module 04 بدون رياضيات؟",
    31: "إيه الفرق بين decision tree وlogging key يدوي؟",
    32: "لما تتبع prediction path، إمتى تتأكد إنها منطقية جيولوجياً؟",
    33: "إمتى الـmodel بيمسك noise بدل pattern؟",
    34: "إيه رابع قاعدة اللي geology بتضيفها؟",
    35: "إيه أسوأ، false positive ولا false negative؟ وليه الإجابة تعتمد؟",
    36: "إيه الفرق بين precision وrecall في قرار الحفر؟",
    37: "ليه accuracy ممكن تكون مضللة جداً؟",
    38: "إمتى anomaly تتحول إلى target؟",
    39: "إمتى deep learning أفضل من trees؟ وإمتى لا؟",
    40: "لو distance to road top feature، ده معناه إيه؟",
    41: "إيه الفرق بين explainable وcorrect؟",
    42: "إيه الأربع أسئلة اللي بتتكرر في كل stop؟",
    43: "أي مرحلة تأخذ أكبر وقت عملياً؟",
    44: "إيه false positives في alteration mapping؟",
    45: "إمتى multivariate anomaly أحسن من univariate؟",
    46: "هل AI يقدر يجعل inversion unique؟",
    47: "إيه دور الجيولوجي في core vision pipeline؟",
    48: "إيه الفرق بين statistical domain وgeological domain؟",
    49: "إمتى data governance أهم من algorithm؟",
    50: "إيه الفرق بين public case study وproof؟",
    51: "إيه خطوات prospectivity defensible؟",
    52: "لو عندك greenfields بلا labels، إيه approach؟",
    53: "إيه السؤال الأول اللي هتسأله قبل modelling؟",
    54: "أي evidence تتوقعه من porphyry تحت cover؟",
    55: "هل high-quality layer معناها مناسبة لكل grid؟",
    56: "هل unexplored ground negative label؟",
    57: "إيه الفرق بين prospectivity وconfidence وfeasibility؟",
    58: "إمتى ترفض model رغم score عالي؟",
    59: "هل barren hole معناها model failure؟",
    60: "إيه الجزء اللي عمله model والجزء اللي عمله geologist؟",
    61: "إيه failure mode اللي ممكن يمر خفي؟",
    62: "إيه الأسئلة الخمسة اللي بتكشف الـfailure؟",
    63: "إيه extrapolation في exploration؟",
    64: "سمّي الـflaw في كل نتيجة قبل ما تشوف الإجابة.",
    65: "هل تقدر تستخدم الأربع أسئلة بدون فهم algorithm؟",
    66: "إزاي ترفض نتيجة بشكل مهني؟",
    67: "فين بالتحديد الفجوة بين data والـEarth؟",
    68: "إيه المهارة اللي كل geologist لازم يضيفها؟",
    69: "إيه أهم فئة أدوات للخريج؟",
    70: "إيه اللي مش مسموح تعمله مع LLM؟",
    71: "فين تقع مسؤولية الإنسان في Draft→Verify→Cite→Review؟",
    72: "ليه data discipline قبل deep learning؟",
    73: "أي role يجمع أكثر بين geology وdata؟",
    74: "إيه خطوة واحدة تقدر تنفذها هذا الأسبوع؟",
    75: "أي term تقدر تشرحه الآن بدون تعريف؟",
    76: "إيه الفرق بين معرفة AI وinterrogating a model؟",
}

DELIVERY_NOTES = {
    4:  ["سيب الطلبة يجاوبوا على الاستبيان قبل ما تكمل. الهدف مش الإجابة الصح، الهدف expose assumptions."],
    5:  ["اربط كل مثال بمثال من خبرتهم الميدانية. اسأل: مين عمل classification قبل كده؟"],
    9:  ["اسأل: إمتى rule بسيطة تكون أفضل مهنياً من model؟"],
    10: ["وضح الفرق بين AI وML وDL وLLM بأمثلة، مش تعريفات."],
    11: ["اربط كل نوع تعلم بمثال exploration حقيقي."],
    12: ["اسأل: إيه اللي AI ممكن يعمله فعلاً وإيه اللي مش هيعمله أبداً؟"],
    13: ["وضح إن random split في geology ممكن يخدع."],
    18: ["اربط QA/QC بأمثلة حقيقية من مشاريع exploration."],
    19: ["خلي الطلبة يلاقوا المشاكل السبعة بنفسهم قبل ما تعرض الإجابات."],
    20: ["وضح: below detection limit ≠ zero."],
    21: ["اسأل: إيه الفرق بين spatial autocorrelation وindependence؟"],
    26: ["وضح Data Leakage بمثال distance to known deposit."],
    27: ["خلي الطلبة يقترحوا features قبل ما تكمل."],
    28: ["وضح الفرق بين 0.96 و0.71 بالأرقام."],
    32: ["اتبع prediction path خطوة بخطوة."],
    33: ["وضح Overfitting بمثال الطالب اللي حفظ امتحان السنة."],
    34: ["اسأل: independent بالنسبة لإيه؟"],
    35: ["اسأل: إيه أسوأ، FP ولا FN؟ الإجابة تعتمد."],
    36: ["اربط Precision وRecall بتكلفة القرار."],
    37: ["وضح إن accuracy مضللة لما positives نادرة."],
    38: ["وضح إن statistical anomaly ≠ exploration target."],
    39: ["القاعدة: tabular → trees، images → DL."],
    40: ["اسأل: لو distance to road top feature، ده معناه إيه؟"],
    44: ["اسأل: إيه اللي ممكن يقلد alteration signature؟"],
    45: ["وضح متى multivariate أحسن من univariate."],
    46: ["وضح إن inversion non-unique دايماً."],
    47: ["وضح إن الهدف consistency مش استبدال."],
    49: ["اربط data governance بأمثلة من الصناعة."],
    51: ["وضح الفرق بين mineral system model وtreasure map."],
    52: ["خلي الطلبة يدافعوا عن إجاباتهم."],
    55: ["وضح إن data audit هو اللي يحدد model scope."],
    57: ["خلي الطلبة يعملوا ranking قبل ما يكشف ranking model."],
    58: ["وضح إن 'the model said so' مش reason."],
    59: ["وضح إن barren hole مش failure لو أعطى معلومات."],
    62: ["اسمّي كل failure بوضوح."],
    64: ["سيب الطلبة يكتشفوا الـflaw بأنفسهم."],
    65: ["ودّي الطلبة يمشوا الأربع أسئلة على نتيجة حقيقية."],
    66: ["درّبهم على صياغة رفض مهني."],
    70: ["وضح الفرق بين استخدام LLM كأداة وكـauthority."],
    71: ["وضح إن السرعة من AI، الثقة من التحقق."],
    72: ["وضح إن الترتيب أهم من عدد الأدوات."],
    74: ["اطلب من كل طالب يختار خطوة واحدة ويكتبها."],
}

MODULE_OBJECTIVES = {
    "Module 00 — Orientation": "تهيئة القاعة، تحديد توقعات الورشة، وتثبيت فكرة أن AI يوسع pattern recognition لكنه لا يستبدل geological meaning.",
    "Module 01 — Why AI, Why Now": "فهم لماذا دخل AI مجال الاستكشاف، الفرق بين rules وML، وحدود AI ومسؤولية الحكم الجيولوجي.",
    "Module 02 — The Exploration Data Universe": "فهم أشكال بيانات الاستكشاف، data inventory، QA/QC، ومخاطر البيانات الخاطئة أو غير المتسقة.",
    "Module 03 — From Field to Feature": "فهم كيف تتحول الملاحظات الجيولوجية إلى features وmodel-ready rows، ولماذا leakage وspatial validation حاسمان.",
    "Module 04 — How Machine Learning Actually Works": "فهم decision trees، overfitting، validation، classification metrics، anomaly detection، deep learning، وexplainability.",
    "Module 05 — AI Across the Exploration Value Chain": "فهم دور AI في كل مرحلة من مراحل exploration، وإيه human check المطلوب في كل مرحلة.",
    "Module 06 — Case Study — Project Solstice": "تطبيق كل المفاهيم على مشروع حقيقي من data compilation إلى drill decision، وفهم دور الجيولوجي في كل خطوة.",
    "Module 07 — Where AI Fails": "فهم failure modes الخمسة الأساسية والأربعة الإضافية، وإزاي تستخدم الأربع أسئلة للتحقق من أي model result.",
    "Module 08 — Tools & The Future Geologist": "فهم الأدوات المستخدمة فعلاً في الصناعة، والمهارات المطلوبة، وخطوة عملية واحدة للبدء.",
}

TIMING = {
    "Module 00 — Orientation":                            "Act I — Foundations | 15 min | Slides 1–5",
    "Module 01 — Why AI, Why Now":                        "Act I — Foundations | 35 min | Slides 6–14",
    "Module 02 — The Exploration Data Universe":          "Act I — Foundations | 40 min | Slides 15–22",
    "Module 03 — From Field to Feature":                  "Act II — Building Blocks | 35 min | Slides 23–29",
    "Module 04 — How Machine Learning Actually Works":    "Act II — Building Blocks | 50 min | Slides 30–41",
    "Module 05 — AI Across the Exploration Value Chain":  "Act III — Applications | 40 min | Slides 42–52",
    "Module 06 — Case Study — Project Solstice":          "Act III — Applications | 30 min | Slides 53–60",
    "Module 07 — Where AI Fails":                         "Act IV — Judgement | 15 min | Slides 61–67",
    "Module 08 — Tools & The Future Geologist":           "Act IV — Judgement | 10 min | Slides 68–76",
}

CORE_PHRASES = [
    ("Geology first",        "قبل ما نسأل الـmodel، لازم نحدد السؤال الجيولوجي والقرار اللي عايزين ندعمه."),
    ("Model ≠ truth",        "الـmodel بيطلع prediction أو pattern؛ مش بيطلع حقيقة جيولوجية."),
    ("Data quality",         "لو البيانات غلط، AI ممكن يخلي الغلط أكثر إقناعاً، مش أقل."),
    ("Validation",           "اسأل دائماً: اختبرنا على إيه؟ وهل الـtest يمثل الاستخدام الحقيقي؟"),
    ("Features",             "كل feature هي فكرة جيولوجية اتترجمت إلى رقم."),
    ("Explainability",       "لو مش عارف model اعتمد على إيه، يبقى لسه مش جاهز تدافع عن النتيجة."),
    ("Human responsibility", "الـAI يساعد في التحليل؛ الجيولوجي يظل مسؤولاً عن التفسير والقرار والدفاع عن الدليل."),
]

REFERENCE_MODULES = [
    ("R01 — Project Setup",      "من القرار إلى الخطة", [
        "Question: أي قرار هذا المشروع سوف يحسّنه؟",
        "Hypothesis: اكتب منطق mineral system قبل أي software.",
        "Inventory: سجل كل layer مع owner، تاريخ، extent، scale، units.",
        "Target: حدد وحدة prediction.",
        "Measure: اختر مقياس نجاح مرتبط بالقرار.",
        "Baseline: ابني أبسط comparator.",
        "Gate: حدد stop/go criteria.",
    ]),
    ("R02 — Data Audit & QA/QC", "من ملفات legacy إلى evidence موثوق", [
        "Register", "Locate", "Standardise", "Validate", "QA/QC", "Coverage", "Release",
    ]),
    ("R03 — Geochemistry",       "من sample إلى anomaly موثوق", [
        "Design", "Assay", "Domain", "Transform", "Detect", "Vector", "Verify",
    ]),
    ("R04 — Remote Sensing",     "من pixels إلى field traverse", [
        "Question", "Acquire", "Correct", "Extract", "Classify", "Screen", "Ground truth",
    ]),
    ("R05 — Geophysics",         "من signal إلى target قابل للاختبار", [
        "Objective", "Audit", "Enhance", "Invert", "Integrate", "Uncertainty", "Test",
    ]),
    ("R06 — Core Vision",        "من صورة إلى geological log", [
        "Standardise", "Label", "Split", "Train", "Review", "Integrate", "Monitor",
    ]),
    ("R07 — 3D Modelling",       "من observations إلى plausible worlds", [
        "Frame", "Compile", "Interpret", "Interpolate", "Estimate", "Simulate", "Update",
    ]),
    ("R08 — Prospectivity",      "من mineral system إلى ranked ground", [
        "System", "Proxy", "Prepare", "Model", "Validate", "Explain", "Rank",
    ]),
    ("R09 — Target Ranking",     "من evidence إلى funded programme", [
        "Assemble", "Separate", "Challenge", "Rank", "Design", "Gate", "Learn",
    ]),
    ("R10 — Generative AI",      "من request إلى verified deliverable", [
        "Classify", "Bound", "Draft", "Verify", "Test", "Review", "Record",
    ]),
    ("R11 — Your First Project", "من public data إلى portfolio", [
        "Choose", "Acquire", "Inspect", "Prepare", "Analyse", "Validate", "Communicate",
    ]),
]

REFERENCE_ARABIC_GUIDES = {
    "R01": ("أي قرار جيولوجي عايزين نحسّنه؟", "قبل ما نفتح software، نحدد قرار قابل للتنفيذ: target نرتبه، عينات نعيد تحليلها، أو برنامج حفر نوافق عليه.", "مثال: بدل ما نقول هنستخدم AI على كل البيانات، نقول هنرتب أفضل 20 منطقة للـfield follow-up خلال أسبوعين.", "لو النتيجة مش هتغير قرار، يبقى المشروع لسه فكرة عامة مش سؤال قابل للاختبار."),
    "R02": ("هل نقدر ندمج البيانات من غير ما نخترع pattern جيولوجي؟", "الـdata audit هو بوابة المشروع. كل layer لازم يكون لها owner، مصدر، coordinate system، units، coverage، ومشاكل معروفة.", "مثال: لو survey magnetics متقسم بين datum قديم وجديد، boundary في الخريطة ممكن يكون processing artefact مش contact جيولوجي.", "أي قيمة لا يمكن تتبعها للمصدر أو تفسير تحويلها لازم تدخل quarantine قبل الـmodelling."),
    "R03": ("إيه الـgeochemical pattern اللي anomalous داخل سياقه؟", "الـanomaly مش رقم عالي وخلاص. لازم نحدد medium والـregolith والـlithology والـbackground قبل أي threshold أو clustering.", "مثال: Cu عالي في transported soil ممكن يعكس drainage أو contamination، بينما نفس الرقم في domain مختلف له معنى تاني.", "أي anomaly لازم ترجع للـground وتتختبر بعينة مستقلة قبل ما تتحول إلى target حفر."),
    "R04": ("فين الـsurface evidence اللي يدعم mineral system؟", "Remote sensing يديك spectral evidence، لكنه لا يثبت ore. لازم نصلح الصورة، نزيل false positives، ثم نرجع للصخر والـfield spectra.", "مثال: playa evaporite ممكن يقلد clay alteration في band ratios، لذلك الخريطة وحدها لا تكفي.", "الـhuman check هو ground truth عبر high وmedium وlow predictions، مش زيارة أعلى pixel فقط."),
    "R05": ("أي physical-property pattern ممكن يمثل source أو pathway أو target؟", "الـgeophysics تقيس contrast فيزيائي، وإحنا نفسره جيولوجياً. الـinversion يسرّع الاحتمالات لكنه لا يلغي non-uniqueness.", "مثال: magnetic edge ممكن يكون fault، survey merge، أو contact بين barren units؛ لازم test يفرق بينهم.", "كل interpretation لازم تعرض alternative models وdepth of investigation وقرار المتابعة."),
    "R06": ("إزاي نخلي core logging أسرع وأكثر consistency من غير ما نمسح حكم الجيولوجي؟", "Computer vision مناسب لما capture والـlabels والـreview مضبوطين. النموذج يساعد في الحالات الروتينية، والجيولوجي يمسك الحالات الملتبسة.", "مثال: model يقترح fracture picks على 1000 متر core، والـlogger يراجع uncertainty queue مع الصورة الأصلية.", "أي output آلي لازم يكون reversible، له confidence، واسم reviewer وإصدار model."),
    "R07": ("إيه التكوينات ثلاثية الأبعاد اللي ما زالت متوافقة مع observations؟", "الـ3D model مش surface واحدة مؤكدة. هو مجموعة فرضيات تتحدث كلما hole جديدة تختبر contacts والـgrade والـstructure.", "مثال: hole جديدة تكشف أن contact المتوقع أعمق؛ نحدّث الفكرة الجيولوجية، مش نحرّك السطح فقط علشان يطابق النتيجة.", "اعرض uncertainty والـalternative realisations، خصوصاً حيث geometry extrapolated."),
    "R08": ("فين الأدلة التي تكمل mineral system وتستحق follow-up؟", "Prospectivity map تجمع source وpathway وtrap وpreservation في proxies قابلة للرسم، ثم تختبرها spatially.", "مثال: score عالي بسبب fault intersection وmagnetic destruction، لكن coverage ضعيف؛ ده target محتمل وليس treasure map.", "كل score لازم يجي معه evidence card، data density، uncertainty، وأول test يقدر يثبت أو يرفض الفرضية."),
    "R09": ("أي target يستحق الدولار التالي، وليه؟", "الفريق لا يشتري score واحد. افصل prospectivity عن confidence وعن drill feasibility، ثم صمم أرخص اختبار حاسم.", "مثال: target عالي جيولوجياً لكن الوصول إليه مكلف؛ infill soil أو IP line قد يكون أفضل من drill مباشرة.", "حدد advance وhold وkill criteria قبل ظهور النتيجة حتى لا نغيّر القاعدة بعد رؤية outcome."),
    "R10": ("إزاي نستخدم Generative AI من غير ما يتحول إلى مصدر غير موثق؟", "استخدمه كمساعد سريع في drafting أو extraction أو code explanation، لكن اقفل الدورة بـVerify وCite وReview.", "مثال: LLM يحول report قديم إلى جدول أولي، ثم نراجع كل grade وcoordinate مقابل الصفحة الأصلية.", "لا تدخل confidential assays أو targets غير منشورة، ولا تفوض accountability إلى software."),
    "R11": ("إزاي أعمل portfolio project محترم من public exploration data؟", "اختار سؤال صغير، احتفظ بالـraw data والـmetadata، اعمل baseline بسيط، واكتب limitations بصدق.", "مثال: map multi-element domains مرتبطة بـlithology في survey عام، مع notebook يعيد كل خطوة.", "المشروع الجيد يثبت geological reasoning وreproducibility، مش عدد algorithms المستخدمين."),
}

REFERENCE_GATE_ARABIC = {
    "Question": "ابدأ بسؤال جيولوجي وقرار واضح؛ ما تبدأش باسم algorithm.",
    "Hypothesis": "اكتب mineral-system logic قبل software: source، pathway، trap، deposition، preservation.",
    "Inventory": "سجّل كل layer ومصدرها ومالكها وتاريخها وscale وunits والـlimitations.",
    "Target": "حدد وحدة prediction: sample، interval، pixel، voxel، prospect، أو drill target.",
    "Measure": "اختار metric مربوط بتكلفة القرار، وليس رقم accuracy جميل فقط.",
    "Baseline": "ابنِ comparator بسيط: threshold، overlay، geological ranking، أو random targeting.",
    "Gate": "حدد مسبقاً إمتى نوقف أو نكمل، ومين صاحب قرار الموافقة.",
    "Register": "اعمل catalogue للملفات والجداول والصور مع source copy لا تتغير.",
    "Locate": "راجع coordinates وdatums وaxis order على خريطة موثوقة.",
    "Standardise": "وحّد الوحدات والـvocabulary مع الاحتفاظ بالقيم الأصلية وسجل التحويل.",
    "Validate": "افصل بين impossible value وunusual value وinteresting geology قبل التنظيف.",
    "QA/QC": "اربط blanks وduplicates وstandards وlab batches قبل استعمال assays.",
    "Coverage": "اعرض density وmissingness وinterpolation حتى لا يتقرأ غياب البيانات كـbarren.",
    "Release": "جمّد نسخة model-ready قابلة لإعادة الإنتاج، وافصل raw عن cleaned data.",
    "Design": "اختار medium وspacing واتجاه sampling حسب footprint المتوقع والـtransport.",
    "Assay": "احتفظ بالـmethod والـdetection limits والـbatch والـQA/QC، مش بالقيمة وحدها.",
    "Domain": "افصل populations حسب lithology وregolith وdrainage قبل تعريف background.",
    "Transform": "تعامل مع skew وcomposition وnon-detect flags من غير تحويل صامت إلى zero.",
    "Detect": "استخدم thresholds وPCA وclustering أو anomaly score مع إبقاء raw values ظاهرة.",
    "Vector": "فسّر direction والـzoning، مش intensity فقط، واربطها بالـstructure والـalteration.",
    "Verify": "ارجع للأرض: resample، افحص contamination، وسجّل observation مستقل.",
    "Acquire": "اختار sensor وseason وresolution المناسبين للـmineral clue، مش للصورة الأجمل.",
    "Correct": "طبّق atmospheric وtopographic correction وmasking قبل تفسير spectral signal.",
    "Extract": "حوّل physics إلى ratios وsimilarity وtexture وlineament candidates قابلة للفحص.",
    "Classify": "احتفظ بالـprobabilities، ولا تجعل hard class تخفي uncertainty.",
    "Screen": "اختبر false positives من playa وvegetation وroads وburn scars والـshadow.",
    "Ground truth": "زُر high وmedium وlow predictions، وسجّل rock وspectra وphotographs.",
    "Objective": "سمّي physical contrast المتوقع: susceptibility، density، conductivity، chargeability أو velocity.",
    "Audit": "راجع acquisition وnoise وlevelling وfilters وحدود survey قبل أي inversion.",
    "Enhance": "استخدم derivatives أو attributes فقط لو كل transform يجاوب سؤالاً جيولوجياً.",
    "Invert": "اعرض bounds وreference model وregularisation والـalternative solutions.",
    "Integrate": "اربط property volume بالـpetrophysics والـlogs والـcontacts والـmineralisation.",
    "Uncertainty": "أظهر sensitivity وdepth of investigation وmodel spread، مش preferred section فقط.",
    "Test": "صمم observation جديد يفرّق بين تفسيرين، لا مجرد test يؤكد رأيك.",
    "Label": "خلّي senior geologists يتفقوا على classes والـambiguous cases قبل training.",
    "Split": "اعزل whole holes أو campaigns، مش patches من نفس tray.",
    "Train": "خلي task ضيق وقابل للتحقق: classification أو segmentation أو fracture detection.",
    "Review": "وجّه uncertainty queue للجيولوجي، مع الصورة الأصلية والـmodel evidence.",
    "Monitor": "راقب drift حسب rig وcamera وlithology والوقت، وأعد التدريب بعد تغير standards.",
    "Frame": "حدد purpose وscale؛ district model غير deposit model وغير resource model.",
    "Compile": "وحّد collars وsurveys وcontacts وassays وstructures في 3D frame موثوق.",
    "Interpret": "ضع geological constraints والعلاقات الزمنية قبل interpolation.",
    "Interpolate": "وثّق أين geometry data-driven وأين extrapolated.",
    "Estimate": "قارن الخطأ بالـsampling والـgeological uncertainty، ولا تعبر hard boundaries بلا سبب.",
    "Simulate": "ولّد plausible alternatives واختبر هل القرار ثابت بينها.",
    "Update": "عامل كل hole كاختبار: ماذا أكدت؟ وماذا falsified؟",
    "System": "اكتب source–pathway–trap–preservation والـore-forming process قبل layers.",
    "Proxy": "حوّل كل ingredient إلى evidence layer بجملة جيولوجية واتجاه وscale.",
    "Prepare": "Align support وextent وmissingness مع الحفاظ على confidence masks.",
    "Model": "استخدم expert weights مع labels قليلة، وsupervised فقط مع positives وnegatives defensible.",
    "Explain": "اعرض contributing layers والـanalogues والـdata density والـextrapolation.",
    "Rank": "أضف depth وtenure وaccess وcost وأول test، ولا تخلط score بالثقة.",
    "Assemble": "اعمل target card موحدة تلخص evidence والتناقضات والـcoverage.",
    "Separate": "افصل prospectivity عن confidence وعن feasibility قبل دمجهم.",
    "Challenge": "اكتب أقوى تفسير بديل من غير mineralisation، وحدد ما يفرّق بينهما.",
    "Design": "اختار أرخص test يقلل uncertainty المسيطرة على القرار.",
    "Learn": "سجّل prediction مقابل observation وحدّث portfolio والـsystem model.",
    "Bound": "اكتب prompt محدوداً يحدد role وaudience وevidence والوحدات والـoutput.",
    "Draft": "اطلب first pass في structure أو extraction أو code، مش geological authority.",
    "Record": "احفظ source وpurpose وtool/date والتعديلات والـreviewer والـlimitations.",
    "Choose": "اختار سؤالاً صغيراً يخلص في عطلتين، وله data وdecision واضحان.",
    "Inspect": "ارسم البيانات قبل modelling: locations وdistributions وmissingness والـboundaries.",
    "Prepare": "وثّق non-detects والـduplicates والـexclusions والـtransforms في data dictionary.",
    "Analyse": "استخدم method واحدة بسيطة مع baseline، وما tuning لمجرد خريطة أجمل.",
    "Communicate": "انشر map واحدة وmethod وlimitations وnext field test مع خطوات reproducible.",
}

# ═════════════════════════════════════════════════════════════════════════════
# BUILD DOCUMENT
# ═════════════════════════════════════════════════════════════════════════════
doc = Document()

sec = doc.sections[0]
sec.top_margin = Inches(0.65)
sec.bottom_margin = Inches(0.65)
sec.left_margin = Inches(0.8)
sec.right_margin = Inches(0.8)

styles = doc.styles
styles["Normal"].font.name = "Arial"
styles["Normal"].font.size = Pt(11)
styles["Normal"]._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")
for sty in ["Title", "Heading 1", "Heading 2", "Heading 3"]:
    styles[sty].font.name = "Arial"
    styles[sty]._element.rPr.rFonts.set(qn("w:eastAsia"), "Arial")

# ─── Title page (English only → normal LTR) ────────────────────────────────
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = title.add_run("A Geologist's Guide to AI & Machine Learning in Mineral Exploration")
r.bold = True
r.font.size = Pt(20)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Complete Detailed Instructor Transcript — Egyptian Arabic\n"
              "Live Workshop + Reference Library | All 125 App Slides")
r.bold = True
r.font.size = Pt(15)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run("Full delivery script | Geology-first | No coding required").italic = True

doc.add_paragraph(
    "This document mirrors the complete app guide: 76 live workshop slides, "
    "4 reference-library orientation slides, 44 workflow slides across R01–R11, "
    "and the final reference close. The delivery notes are written in natural "
    "Egyptian Arabic and keep the app's structure: purpose, walkthrough, human "
    "check, worked example, interaction, and next step."
)

# ─── Bilingual heading — auto RTL ──────────────────────────────────────────
add_bidi_heading(doc, "How to use this transcript — إزاي تستخدم النص ده", level=1)

for item in [
    "اقرأ الكلام بصوت طبيعي. مش مطلوب حفظ حرفي — الهدف إنك تستخدمه كـspeaker notes.",
    "عند وجود interactive slide، اسأل الطلبة قبل ما تشرح الإجابة؛ سيب مساحة للاختلاف.",
    "ركز على الجملة المحورية في كل slide، ثم استخدم التفاصيل حسب مستوى القاعة.",
    "أي مثال أو رقم في العرض الأصلي يظل مرتبطاً بسياقه؛ لا تعرض المثال كأنه نتيجة عامة.",
    "احتفظ بالقاعدة المتكررة: model produces evidence؛ الجيولوجي يفسر ويدافع عن المعنى.",
    "لو الوقت ضيق، اختصر الأقسام الفرعية وابقَ على الجملة المحورية والأسئلة التفاعلية.",
]:
    add_bidi_paragraph(doc, item, style="List Bullet")

# ─── Main workshop modules ─────────────────────────────────────────────────
for mname, (a, b) in MODULE_RANGES.items():
    doc.add_page_break()
    # Module name is English so the heading itself will render LTR.
    add_bidi_heading(doc, mname, level=1)
    add_bidi_paragraph(doc, TIMING[mname])

    add_bidi_heading(doc, "Module objective", level=2)
    add_bidi_paragraph(doc, MODULE_OBJECTIVES[mname])

    for n in range(a, b + 1):
        add_bidi_heading(doc, f"Slide {n} — {SLIDE_TITLES[n]}", level=2)

        add_bidi_paragraph(doc, "🎤", bold=True)

        for para in T[n].split("\n\n"):
            p = add_bidi_paragraph(doc, para.strip())
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.line_spacing = 1.12

        add_bidi_paragraph(doc, "🧭 سؤال تفاعلي", bold=True)
        add_bidi_paragraph(doc, QUESTIONS[n], style="List Bullet")

        if n in DELIVERY_NOTES:
            add_bidi_paragraph(doc, "📝 ملاحظات للتقديم", bold=True)
            for note in DELIVERY_NOTES[n]:
                add_bidi_paragraph(doc, note, style="List Bullet")

# ─── Core phrases ──────────────────────────────────────────────────────────
doc.add_page_break()
add_bidi_heading(doc, "Core instructor phrases — العبارات الأساسية", level=1)
for h, b in CORE_PHRASES:
    add_bidi_paragraph(doc, f"{h}: {b}")

# ─── Reference library (Module 09) ─────────────────────────────────────────
doc.add_page_break()
add_bidi_heading(doc, "Module 09 — Reference Workflows", level=1)
add_bidi_paragraph(doc, "Optional self-study | 49 app slides | 11 reusable workflows")

def reference_code(module_name):
    return module_name.split(" —", 1)[0]

def reference_gate_names(gates):
    if len(gates) == 1:
        return [part.strip() for part in gates[0].split("،")]
    return [g.split(":", 1)[0].strip() for g in gates]

def reference_gate_text(gate_name):
    return REFERENCE_GATE_ARABIC.get(
        gate_name,
        "اشرح هذه المرحلة كقرار قابل للمراجعة، وحدد الدليل والـhuman check والـdeliverable قبل الانتقال.",
    )

def add_reference_slide(number, title, body, question, transition):
    add_bidi_heading(doc, f"Slide {number} — {title}", level=2)
    add_bidi_paragraph(doc, "🎤", bold=True)
    for paragraph in body.split("\n\n"):
        p = add_bidi_paragraph(doc, paragraph.strip())
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.12
    add_bidi_paragraph(doc, "🧭 سؤال تفاعلي", bold=True)
    add_bidi_paragraph(doc, question, style="List Bullet")
    add_bidi_paragraph(doc, "🔗 إلى أين ننتقل؟", bold=True)
    add_bidi_paragraph(doc, transition)

reference_slide = 77

add_reference_slide(
    reference_slide,
    "Reference Workflows",
    "الجزء ده هو field manual بعد الورشة. إحنا مش بنضيف algorithms لمجرد الإبهار؛ إحنا بنحوّل الأفكار إلى workflows تتكرر على مشروع حقيقي. كل workflow يبدأ بسؤال جيولوجي وينتهي بقرار موثق.",
    "إيه القرار اللي محتاجه في شغلك وتقدر تحوله إلى workflow من سبع بوابات؟",
    "هنبدأ بطريقة استخدام الـmanual، وبعدها نختار method من السؤال وشكل البيانات.",
)
reference_slide += 1
add_reference_slide(
    reference_slide,
    "Every workflow has the same seven gates",
    "كل workflow في التطبيق ماشي بنفس الترتيب: Question، Evidence، Preparation، Method، Output، Validation، Decision. لو قفزنا من data إلى score، بنفقد الجزء اللي يخلي النتيجة قابلة للدفاع.",
    "أي بوابة في رأيك تمنع أكبر عدد من الأخطاء لو اتعملت بجد؟",
    "بعد ما نثبت البوابات، نختار الطريقة من السؤال والبيانات، مش من الموضة.",
)
reference_slide += 1
add_reference_slide(
    reference_slide,
    "Choose the method from the question and data",
    "لو السؤال classification، ابدأ بـrule أو decision tree. لو continuous value، ابدأ بـbaseline أو kriging. لو natural groups، ابدأ بالـplots وPCA. ولو favourable ground، ابدأ بـmineral-system overlays. القاعدة: لو method أبسط بتجاوب القرار، قف عندها.",
    "لو عندك greenfields بلا labels، ليه supervised model من منطقة تانية ممكن يكون قراراً سيئاً؟",
    "دلوقتي نعمل reference map يوضح إن كل workflow له diagram وanimated walkthrough وchecklist.",
)
reference_slide += 1
add_reference_slide(
    reference_slide,
    "Eleven reference modules",
    "قدامنا 11 workflow: من Project Setup وData Audit إلى Geochemistry وRemote Sensing وGeophysics وCore Vision و3D Modelling وProspectivity وTarget Ranking وGenerative AI وYour First Project. كل واحد له نفس السبع gates، لكن الـhuman check مختلف حسب geology والقرار.",
    "أي workflow من الـ11 أقرب لمشكلة عندك الآن؟ وإيه أول evidence تحتاج تجمعها؟",
    "نبدأ بـR01: تحويل الطموح العام إلى قرار جيولوجي قابل للاختبار.",
)
reference_slide += 1

for module_name, module_desc, gates in REFERENCE_MODULES:
    code = reference_code(module_name)
    question, opening, example, principle = REFERENCE_ARABIC_GUIDES[code]
    gate_names = reference_gate_names(gates)
    gate_chain = " → ".join(gate_names)

    add_reference_slide(
        reference_slide,
        f"{module_name}: {module_desc}",
        f"{opening}\n\nالسؤال المركزي في هذا الـworkflow هو: {question} الإجابة النهائية ليست خريطة جميلة؛ هي deliverable يقدر الفريق يراجعه ويتخذ عليه خطوة.",
        question,
        f"هنشوف الخريطة كاملة من اليسار لليمين: {gate_chain}.",
    )
    reference_slide += 1

    add_reference_slide(
        reference_slide,
        "The workflow at a glance",
        f"اقرأوا الـworkflow كـchain وليس كقائمة أسماء. كل gate تنتج evidence أو قراراً صغيراً يسمح بالانتقال للبوابة التالية. في {code}، المسار هو: {gate_chain}.\n\nالمثال اللي هنحتفظ به طول الطريق: {example}",
        f"لو اضطررت توقف الـworkflow عند بوابة واحدة في {code}، هتوقف فين؟ وإيه الدليل الناقص؟",
        "بعد الصورة العامة، هنشغّل الـworkflow gate by gate ونفحص human check في كل مرحلة.",
    )
    reference_slide += 1

    animated_body = f"دلوقتي نمشي ببطء على {code}. ما تقرأش اسم المرحلة كأنه إنجاز؛ اسأل دائماً: إيه اللي اتغير في فهمنا؟ وإيه الـdeliverable اللي خرج؟\n\n{principle}"
    for gate_name in gate_names:
        animated_body += f"\n\n{gate_name}: {reference_gate_text(gate_name)}"
    add_reference_slide(
        reference_slide,
        module_desc,
        animated_body,
        f"في {code}، أي بوابة ممكن تنتج false confidence لو اتعملت بشكل سطحي؟",
        "هنحوّل الكلام إلى checklist قابلة للطباعة، بحيث كل gate لها check وdeliverable واضح.",
    )
    reference_slide += 1

    checklist_body = f"دي checklist المدرب والـtechnical reviewer في {code}. امشِ على كل بوابة، واكتب evidence قبل ما تعتبرها مكتملة.\n\n{example}"
    for index, gate_name in enumerate(gate_names, 1):
        checklist_body += (
            f"\n\n{index}. {gate_name}\n"
            f"{reference_gate_text(gate_name)}\n"
            "Human check: هل يقدر geologist آخر يراجع القرار من غير ما يسأل عن معلومات مخفية؟"
        )
    add_reference_slide(
        reference_slide,
        "Gate-by-gate checklist you can reuse",
        checklist_body,
        f"إيه الـdeliverable اللي هتحتفظ به كدليل إن {code} اتعمل بشكل defensible؟",
        "لو كل gate مكتملة، نقدر ننتقل من workflow إلى قرار مرحلي، مع uncertainty وnext test واضحين.",
    )
    reference_slide += 1

add_reference_slide(
    reference_slide,
    "The habit that makes a beginner useful",
    "نقفل الـreference library بنفس العادة اللي بدأت بها الورشة: ما تسألش أي algorithm شكله advanced. اسأل: إيه القرار الجيولوجي؟ إيه evidence؟ إزاي اتاختبر على ground ما شافهاش؟ وإيه observation ممكن يثبت إنه غلط؟\n\nدي مش أسئلة امتحان؛ دي طريقة شغل. لما تبقى تلقائية، تقدر تدخل أي technical meeting وتضيف قيمة حتى قبل ما تبني model.",
    "لو هتستخدم عادة واحدة من كل الـmanual، إيه السؤال اللي هتسأله في أول اجتماع؟",
    "بعد كده نرجع إلى closing checklist ونحوّل الفكرة إلى خطوة عملية في مشروعك.",
)

# ─── Closing checklist ─────────────────────────────────────────────────────
doc.add_page_break()
add_bidi_heading(doc, "Closing instructor checklist", level=1)
for x in [
    "هل شرحت input → method → output → human check؟",
    "هل أوضحت الفرق بين anomaly وtarget؟",
    "هل ربطت feature بكل فكرة جيولوجية؟",
    "هل شرحت لماذا spatial validation أهم من random accuracy؟",
    "هل أوضحت أن low score في منطقة بلا data قد يعني no information وليس barren؟",
    "هل أعطيت الطلبة لغة مهنية لرفض نتيجة بدون مهاجمة صاحب النموذج؟",
    "هل خرج كل طالب بخطوة عملية واحدة؟",
]:
    add_bidi_paragraph(doc, x, style="List Bullet")

# ─── Save ──────────────────────────────────────────────────────────────────
output_name = "AI_Mineral_Exploration_Transcript.docx"
output_override = os.environ.get("TRANSCRIPT_OUTPUT")
out = Path(output_override) if output_override else BASE_DIR / output_name
out.parent.mkdir(parents=True, exist_ok=True)
doc.save(str(out))
print(f"Generated: {out} ({out.stat().st_size:,} bytes)")