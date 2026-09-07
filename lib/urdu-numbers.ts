/**
 * Deterministic pre-processing for spoken numbers in Urdu, Roman Urdu and
 * English. This runs before the language model so digits dictated one-by-one
 * ("ایک دو پانچ" → 125) and compound amounts ("ایک لاکھ پچاس ہزار" → 150000)
 * are normalised reliably. The model receives both the raw and the normalised
 * transcript and is told to prefer the normalised digits.
 */

const URDU_DIGITS: Record<string, string> = {
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
}

export function toAsciiDigits(s: string) {
  return s.replace(/[۰-۹٠-٩]/g, (d) => URDU_DIGITS[d] ?? d)
}

export function toUrduDigits(s: string) {
  const map = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return s.replace(/[0-9]/g, (d) => map[Number(d)])
}

// value, isMultiplier
const WORDS: Record<string, [number, boolean]> = {}
function add(value: number, mult: boolean, ...forms: string[]) {
  for (const f of forms) WORDS[f.toLowerCase()] = [value, mult]
}

add(0, false, 'صفر', 'sifar', 'zero', 'oh')
add(1, false, 'ایک', 'aik', 'ek', 'one')
add(2, false, 'دو', 'do', 'two')
add(3, false, 'تین', 'teen', 'tin', 'three')
add(4, false, 'چار', 'chaar', 'char', 'four')
add(5, false, 'پانچ', 'paanch', 'panch', 'five')
add(6, false, 'چھ', 'چھے', 'chay', 'chhay', 'che', 'six')
add(7, false, 'سات', 'saat', 'sat', 'seven')
add(8, false, 'آٹھ', 'aath', 'ath', 'eight')
add(9, false, 'نو', 'nau', 'no', 'nine')
add(10, false, 'دس', 'das', 'ten')
add(11, false, 'گیارہ', 'gyara', 'giyara', 'eleven')
add(12, false, 'بارہ', 'baara', 'bara', 'twelve')
add(13, false, 'تیرہ', 'tera', 'thirteen')
add(14, false, 'چودہ', 'chauda', 'choda', 'fourteen')
add(15, false, 'پندرہ', 'pandra', 'pandrah', 'fifteen')
add(16, false, 'سولہ', 'sola', 'solah', 'sixteen')
add(17, false, 'سترہ', 'satra', 'satrah', 'seventeen')
add(18, false, 'اٹھارہ', 'athara', 'atharah', 'eighteen')
add(19, false, 'انیس', 'unees', 'unnis', 'nineteen')
add(20, false, 'بیس', 'bees', 'bis', 'twenty')
add(21, false, 'اکیس', 'ikees', 'ikkis')
add(22, false, 'بائیس', 'baees', 'bais')
add(23, false, 'تئیس', 'taees', 'teis')
add(24, false, 'چوبیس', 'chaubees', 'chobis')
add(25, false, 'پچیس', 'pachees', 'pachis')
add(26, false, 'چھبیس', 'chabees', 'chhabis', 'chabbis')
add(27, false, 'ستائیس', 'sattaees', 'satais')
add(28, false, 'اٹھائیس', 'athaees', 'athais')
add(29, false, 'انتیس', 'untees', 'untis')
add(30, false, 'تیس', 'tees', 'tis', 'thirty')
add(31, false, 'اکتیس', 'iktees')
add(32, false, 'بتیس', 'batees')
add(33, false, 'تینتیس', 'taintees')
add(34, false, 'چونتیس', 'chauntees')
add(35, false, 'پینتیس', 'paintees')
add(36, false, 'چھتیس', 'chattees')
add(37, false, 'سینتیس', 'saintees')
add(38, false, 'اڑتیس', 'artees')
add(39, false, 'انتالیس', 'untalees')
add(40, false, 'چالیس', 'chalees', 'chalis', 'forty')
add(41, false, 'اکتالیس', 'iktalees')
add(42, false, 'بیالیس', 'bayalees')
add(43, false, 'تینتالیس', 'taintalees')
add(44, false, 'چوالیس', 'chawalees')
add(45, false, 'پینتالیس', 'paintalees')
add(46, false, 'چھیالیس', 'chayalees')
add(47, false, 'سینتالیس', 'saintalees')
add(48, false, 'اڑتالیس', 'artalees')
add(49, false, 'انچاس', 'unchas')
add(50, false, 'پچاس', 'pachaas', 'pachas', 'fifty')
add(51, false, 'اکاون', 'ikyawan')
add(52, false, 'باون', 'bawan')
add(53, false, 'ترپن', 'tirpan')
add(54, false, 'چون', 'chawan')
add(55, false, 'پچپن', 'pachpan')
add(56, false, 'چھپن', 'chappan')
add(57, false, 'ستاون', 'sattawan')
add(58, false, 'اٹھاون', 'athawan')
add(59, false, 'انسٹھ', 'unsath')
add(60, false, 'ساٹھ', 'saath', 'sath', 'sixty')
add(61, false, 'اکسٹھ', 'iksath')
add(62, false, 'باسٹھ', 'basath')
add(63, false, 'تریسٹھ', 'tresath')
add(64, false, 'چونسٹھ', 'chaunsath')
add(65, false, 'پینسٹھ', 'painsath')
add(66, false, 'چھیاسٹھ', 'chayasath')
add(67, false, 'سڑسٹھ', 'sarsath')
add(68, false, 'اڑسٹھ', 'arsath')
add(69, false, 'انہتر', 'unhattar')
add(70, false, 'ستر', 'sattar', 'seventy')
add(71, false, 'اکہتر', 'ikhattar')
add(72, false, 'بہتر', 'bahattar')
add(73, false, 'تہتر', 'tihattar')
add(74, false, 'چوہتر', 'chauhattar')
add(75, false, 'پچھتر', 'pachattar')
add(76, false, 'چھہتر', 'chihattar')
add(77, false, 'ستتر', 'satattar')
add(78, false, 'اٹھتر', 'athattar')
add(79, false, 'اناسی', 'unasi')
add(80, false, 'اسی', 'assi', 'eighty')
add(81, false, 'اکیاسی', 'ikyasi')
add(82, false, 'بیاسی', 'bayasi')
add(83, false, 'تراسی', 'tirasi')
add(84, false, 'چوراسی', 'chaurasi')
add(85, false, 'پچاسی', 'pachasi')
add(86, false, 'چھیاسی', 'chayasi')
add(87, false, 'ستاسی', 'satasi')
add(88, false, 'اٹھاسی', 'athasi')
add(89, false, 'نواسی', 'nawasi')
add(90, false, 'نوے', 'nawway', 'nabbe', 'ninety')
add(91, false, 'اکانوے', 'ikanway')
add(92, false, 'بانوے', 'banway')
add(93, false, 'ترانوے', 'tiranway')
add(94, false, 'چورانوے', 'chauranway')
add(95, false, 'پچانوے', 'pachanway')
add(96, false, 'چھیانوے', 'chayanway')
add(97, false, 'ستانوے', 'satanway')
add(98, false, 'اٹھانوے', 'athanway')
add(99, false, 'ننانوے', 'ninanway')
add(100, true, 'سو', 'so', 'sau', 'hundred')
add(1000, true, 'ہزار', 'hazaar', 'hazar', 'thousand')
add(100000, true, 'لاکھ', 'laakh', 'lakh', 'lac')
add(10000000, true, 'کروڑ', 'crore', 'karor')
add(1000000, true, 'million')

const CONNECTORS = new Set(['اور', 'aur', 'and', 'و'])

function tokenize(text: string) {
  return toAsciiDigits(text)
    .replace(/[،,]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * Parses a sequence of number words to a numeric value.
 * Handles "do hazar chabees" → 2026, "aik lakh pachas hazar" → 150000.
 * Returns null if the sequence contains no number words.
 */
export function parseNumberWords(tokens: string[]): number | null {
  let total = 0
  let current = 0
  let seen = false
  for (const raw of tokens) {
    const t = raw.toLowerCase()
    if (CONNECTORS.has(t)) continue
    if (/^\d+$/.test(t)) {
      current += Number(t)
      seen = true
      continue
    }
    const entry = WORDS[t]
    if (!entry) return seen ? total + current : null
    const [value, mult] = entry
    seen = true
    if (mult) {
      current = (current || 1) * value
      if (value >= 1000) {
        total += current
        current = 0
      }
    } else {
      current += value
    }
  }
  return total + current
}

const DIGIT_WORDS = new Set(
  Object.entries(WORDS)
    .filter(([, [v, m]]) => !m && v <= 9)
    .map(([k]) => k),
)

/**
 * Replaces runs of number words in a transcript with digits.
 *  - Runs made only of single digit words (0–9) are treated as a digit string
 *    ("ایک دو پانچ" → "125", "do sifar paanch" → "205") so FIR and phone numbers
 *    are preserved exactly.
 *  - Otherwise the run is evaluated as a compound number ("dو ہزار چھبیس" → 2026).
 */
export function normalizeSpokenNumbers(text: string) {
  const tokens = tokenize(text)
  const out: string[] = []
  let i = 0
  while (i < tokens.length) {
    const lower = tokens[i].toLowerCase()
    const isNum = WORDS[lower] !== undefined || /^\d+$/.test(lower)
    if (!isNum) {
      out.push(tokens[i])
      i++
      continue
    }
    let j = i
    const run: string[] = []
    while (j < tokens.length) {
      const l = tokens[j].toLowerCase()
      if (WORDS[l] !== undefined || /^\d+$/.test(l) || (CONNECTORS.has(l) && j + 1 < tokens.length && WORDS[tokens[j + 1].toLowerCase()] !== undefined)) {
        run.push(tokens[j])
        j++
      } else break
    }
    const cleanRun = run.filter((r) => !CONNECTORS.has(r.toLowerCase()))
    const allSingleDigits = cleanRun.length >= 2 && cleanRun.every((r) => DIGIT_WORDS.has(r.toLowerCase()) || /^\d$/.test(r))
    if (allSingleDigits) {
      out.push(cleanRun.map((r) => (/^\d$/.test(r) ? r : String(WORDS[r.toLowerCase()][0]))).join(''))
    } else {
      const n = parseNumberWords(cleanRun)
      out.push(n === null ? run.join(' ') : String(n))
    }
    i = j
  }
  return out.join(' ')
}

export function formatPKR(n: number) {
  return `PKR ${n.toLocaleString('en-PK')}`
}
