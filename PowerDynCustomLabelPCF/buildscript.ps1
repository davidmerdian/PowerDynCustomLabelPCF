Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Step 1 - run build
cd C:\Controls\PowerDynCustomLabelPCF\PowerDynCustomLabelPCF
npm run build

# Step 2 - remove build directory and recreate
Remove-Item -Force -Recurse -Path "C:\Controls\PowerDynCustomLabelPCF\PowerDynCustomLabelPCF\PowerDynCustomLabel\*"

# Step 3 - change directory and run processes. 
cd PowerDynCustomLabel
pac solution init --publisher-name PowerDynSolutions --publisher-prefix powerdyn
pac solution add-reference --path C:\Controls\PowerDynCustomLabelPCF

# Step 4 - run builds
MSBUILD /t:restore
MSBUILD

#Step 5 - change back to org folder
cd C:\Controls\PowerDynCustomLabelPCF\PowerDynCustomLabelPCF
PAUSE
