const languages = [
  ["ar","العربية"],["en","الإنجليزية"],["fr","الفرنسية"],["es","الإسبانية"],
  ["de","الألمانية"],["it","الإيطالية"],["tr","التركية"],["ru","الروسية"],
  ["zh-CN","الصينية"],["ja","اليابانية"],["ko","الكورية"],["hi","الهندية"],
  ["ur","الأوردية"],["fa","الفارسية"],["pt","البرتغالية"],["nl","الهولندية"],
  ["el","اليونانية"],["sv","السويدية"],["pl","البولندية"],["id","الإندونيسية"],
  ["ms","الملايوية"],["th","التايلاندية"],["vi","الفيتنامية"],["uk","الأوكرانية"],
  ["he","العبرية"],["bn","البنغالية"],["sw","السواحيلية"],["ro","الرومانية"]
];
const $ = id => document.getElementById(id);
for (const [code,name] of languages) {
  $("fromLang").add(new Option(name,code));
  $("toLang").add(new Option(name,code));
}
$("fromLang").value = "ar";
$("toLang").value = "en";
$("sourceText").addEventListener("input", () => $("count").textContent = `${$("sourceText").value.length} / 500`);
$("clear").onclick = () => { $("sourceText").value=""; $("resultText").value=""; $("count").textContent="0 / 500"; $("status").textContent=""; };
$("swap").onclick = () => {
  const a=$("fromLang").value; $("fromLang").value=$("toLang").value; $("toLang").value=a;
  const src=$("sourceText").value; $("sourceText").value=$("resultText").value; $("resultText").value=src;
};
$("translate").onclick = async () => {
  const q=$("sourceText").value.trim(), from=$("fromLang").value, to=$("toLang").value;
  if(!q){$("status").textContent="اكتب النص الذي تريد ترجمته أولاً.";return;}
  if(from===to){$("resultText").value=q;$("status").textContent="اختر لغتين مختلفتين.";return;}
  $("translate").disabled=true; $("status").textContent="جارٍ الترجمة...";
  try{
    const url=`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${encodeURIComponent(from+"|"+to)}`;
    const response=await fetch(url);
    if(!response.ok) throw new Error("network");
    const data=await response.json();
    const translated=data?.responseData?.translatedText;
    if(!translated) throw new Error("empty");
    $("resultText").value=translated;
    $("status").textContent="تمت الترجمة.";
  }catch(e){
    $("status").textContent="تعذرت الترجمة الآن. تحقق من الإنترنت وحاول مرة أخرى.";
  }finally{$("translate").disabled=false;}
};
$("copy").onclick = async () => {
  const value=$("resultText").value;
  if(!value){$("status").textContent="لا توجد ترجمة لنسخها.";return;}
  try{await navigator.clipboard.writeText(value);$("status").textContent="تم نسخ الترجمة.";}
  catch(e){$("resultText").select();document.execCommand("copy");$("status").textContent="تم النسخ.";}
};
$("speak").onclick = () => {
  const value=$("resultText").value;
  if(!value){$("status").textContent="لا توجد ترجمة للاستماع إليها.";return;}
  if(!("speechSynthesis" in window)){$("status").textContent="ميزة النطق غير مدعومة في هذا المتصفح.";return;}
  const utterance=new SpeechSynthesisUtterance(value);
  const lang=$("toLang").value;
  utterance.lang=lang==="zh-CN"?"zh-CN":lang;
  speechSynthesis.cancel(); speechSynthesis.speak(utterance);
};
