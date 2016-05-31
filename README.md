# node-salesforce
This tool downloads data in batches using force CLI tool.

The main idea is - instead of downloading the whole table, 
select only several fields. However, you can specify so many
records in one statement, so I decided to batch it up.

Specify required fields in **defaultQuery** variable.

File sample.csv should contain id field, which name can specified
in **fieldname** variable

Run this prior starting the script:
./force login -i=test -u testuser@company.com.fullcopy -p 


To run the script type
node extract.js