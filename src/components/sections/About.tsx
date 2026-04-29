import { motion } from 'framer-motion';
import { Code2, Brain, GraduationCap, Globe } from 'lucide-react';

const About = () => {
    return (
        <section className="py-32 px-6 md:px-24 bg-black border-t border-zinc-900 relative">

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-32 items-start">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 pb-12"
                >
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        01. Hakkımda
                    </h2>

                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                        Veriyi anlama, işleme ve <span className="text-zinc-500">geleceği kodlama</span> tutkusu.
                    </h3>

                    <div className="space-y-6 text-zinc-400 leading-relaxed text-lg">
                        <p>
                            Merhaba, ben <strong className="text-white">Talha Kaya</strong>. Sakarya Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim.
                            Bilgisayarla uğraşmayı seviyorum ama beni asıl motive eden şey, <strong className="text-white">karşıma çıkan problemleri kurcalamak</strong>, parçalarına ayırmak ve gerçekten işe yarayan çözümler üretmek.
                        </p>
                        <p>
                            Yazılıma <strong className="text-white">Python ve C++</strong> ile başladım. Zaman içinde en çok ilgimi çeken alanın <strong className="text-white">makine öğrenmesi</strong> olduğunu fark ettim. Bir modelin sadece sonuç üretmesi değil, neden o sonucu verdiğini anlamak bana daha heyecan veriyor. Bu ilgimi <strong className="text-white">Arvasis Yazılım</strong>’da yaptığım stajda pratiğe dökme şansı buldum. Burada, 65 farklı dili destekleyen <strong className="text-white">OCR modelleri</strong> üzerinde çalışarak öğrendiklerimi gerçek projelerde kullandım.
                        </p>
                        <p>
                            Teknik konuların yanında iletişimin de işin önemli bir parçası olduğuna inanıyorum. <strong className="text-white">İngilizce (B2)</strong> seviyesinde teknik kaynakları takip edebiliyor, öğrendiklerimi başkalarına anlatmaktan çekinmiyorum. Meraklı yapım sayesinde <strong className="text-white">Reinforcement Learning’den Computer Vision’a</strong> kadar farklı alanları denemeyi ve kendimi sürekli geliştirmeyi seviyorum.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="content-start w-full mt-40 lg:pl-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                        <div className="group relative aspect-[1.6/1] p-6 flex flex-col justify-between bg-[#F2F0E9] text-black transition-transform duration-300 hover:-translate-y-1">
                            <div className="flex justify-between items-start z-10">
                                <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Eğitim</h4>
                                <span className="text-[10px] font-mono opacity-40">01</span>
                            </div>
                            <div className="z-10">
                                <p className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-2">
                                    Sakarya<br />Uni.
                                </p>
                                <p className="text-xs font-bold opacity-60 uppercase tracking-wider">Bilgisayar Müh. 3. Sınıf</p>
                            </div>
                            <GraduationCap className="absolute bottom-4 right-4 text-black opacity-[1.0] group-hover:opacity-[0.07] transition-opacity scale-[2.5] origin-bottom-right" strokeWidth={1.5} />
                        </div>

                        <div className="group relative aspect-[1.6/1] p-6 flex flex-col justify-between bg-[#C4C4C4] text-black transition-transform duration-300 hover:-translate-y-1">
                            <div className="flex justify-between items-start z-10">
                                <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Alanlar</h4>
                                <span className="text-[10px] font-mono opacity-40">02</span>
                            </div>
                            <div className="z-10">
                                <p className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-2">
                                    Machine<br />Learning
                                </p>
                                <p className="text-xs font-bold opacity-60 uppercase tracking-wider">Deep Learning • RL</p>
                            </div>
                            <Brain className="absolute bottom-4 right-4 text-black opacity-[1.0] group-hover:opacity-[0.07] transition-opacity scale-[2.5] origin-bottom-right" strokeWidth={1.5} />
                        </div>

                        <div className="group relative aspect-[1.6/1] p-6 flex flex-col justify-between bg-[#0A0A0A] text-white transition-transform duration-300 hover:-translate-y-1">
                            <div className="flex justify-between items-start z-10">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Stack</h4>
                                <span className="text-[10px] font-mono text-zinc-700">03</span>
                            </div>
                            <div className="z-10">
                                <p className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-3">
                                    Teknik<br />Stack
                                </p>
                                <div className="flex flex-wrap gap-1.5 opacity-80">
                                    {['Python', 'C++', 'PyTorch', 'OpenCV', 'Numpy', 'Pandas', 'Scikit-learn'].map(t => (
                                        <span key={t} className="text-[10px] border border-zinc-800 bg-zinc-900/50 px-2 py-0.5 rounded-full text-zinc-400 font-medium">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Code2 className="absolute bottom-4 right-4 text-white opacity-[1.0] group-hover:opacity-[0.07] transition-opacity scale-[2.5] origin-bottom-right" strokeWidth={1.5} />
                        </div>

                        <div className="group relative aspect-[1.6/1] p-6 flex flex-col justify-between bg-[#689466] text-black transition-transform duration-300 hover:-translate-y-1">
                            <div className="flex justify-between items-start z-10">
                                <h4 className="text-xs font-bold uppercase tracking-widest opacity-60">Dil</h4>
                                <span className="text-[10px] font-mono opacity-40">04</span>
                            </div>
                            <div className="z-10">
                                <p className="text-3xl md:text-4xl font-black tracking-tighter leading-[0.9] mb-2">
                                    İngilizce<br />(B2)
                                </p>
                                <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Hazırlık + Teknik</p>
                            </div>
                            <Globe className="absolute bottom-4 right-4 text-black opacity-[1.00] group-hover:opacity-[0.07] transition-opacity scale-[2.5] origin-bottom-right" strokeWidth={1.5} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
