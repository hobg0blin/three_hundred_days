numdirs=(*/)
numdirs=${#numdirs[@]}
echo "${numdirs}"
lastdir="$(($numdirs - 1))"
lastdir="day$lastdir"
newdir="day$numdirs"
echo "${lastdir}"
cp -r ${lastdir} ${newdir}
rm -r */node_modules/
cd ${newdir}
npm install
npm run dev
