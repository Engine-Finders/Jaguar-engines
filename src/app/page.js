import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HomeSec1 from "@/components/home/HomeSec1";
import HomeSec2 from "@/components/home/HomeSec2";
import HomeSec3 from "@/components/home/HomeSec3";
import HomeSec4 from "@/components/home/HomeSec4";
import HomeSec5 from "@/components/home/HomeSec5";
import HomeSec6 from "@/components/home/HomeSec6";
import HomeSec7 from "@/components/home/HomeSec7";
import HomeSec8 from "@/components/home/HomeSec8";
import HomeSec9 from "@/components/home/HomeSec9";
import HomeSec10 from "@/components/home/HomeSec10";
import HomeSec11 from "@/components/home/HomeSec11";
import HomeSec12 from "@/components/home/HomeSec12";
import HomeSec13 from "@/components/home/HomeSec13";
import HomeSec14 from "@/components/home/HomeSec14";
import navbarData from "@/data/shared/navbar.json";
import footerData from "@/data/shared/footer.json";
import homeSec1Data from "@/data/home/homeSec1.json";
import homeSec2Data from "@/data/home/homeSec2.json";
import homeSec3Data from "@/data/home/homeSec3.json";
import homeSec4Data from "@/data/home/homeSec4.json";
import homeSec5Data from "@/data/home/homeSec5.json";
import homeSec6Data from "@/data/home/homeSec6.json";
import homeSec7Data from "@/data/home/homeSec7.json";
import homeSec8Data from "@/data/home/homeSec8.json";
import homeSec9Data from "@/data/home/homeSec9.json";
import homeSec10Data from "@/data/home/homeSec10.json";
import homeSec11Data from "@/data/home/homeSec11.json";
import homeSec12Data from "@/data/home/homeSec12.json";
import homeSec13Data from "@/data/home/homeSec13.json";
import homeSec14Data from "@/data/home/homeSec14.json";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white text-black">
      <Navbar data={navbarData} />
      <main className="flex-1">
        <HomeSec1 data={homeSec1Data} />
        <HomeSec2 data={homeSec2Data} />
        <HomeSec3 data={homeSec3Data} />
        <HomeSec4 data={homeSec4Data} />
        <HomeSec5 data={homeSec5Data} />
        <HomeSec6 data={homeSec6Data} />
        <HomeSec7 data={homeSec7Data} />
        <HomeSec8 data={homeSec8Data} />
        <HomeSec9 data={homeSec9Data} />
        <HomeSec10 data={homeSec10Data} />
        <HomeSec11 data={homeSec11Data} />
        <HomeSec12 data={homeSec12Data} />
        <HomeSec13 data={homeSec13Data} />
        <HomeSec14 data={homeSec14Data} />
      </main>
      <Footer data={footerData} />
    </div>
  );
}
