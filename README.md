# A couple of useful node.js and Salesforce tools

# node force extract.js
This tool queries data in batches using force CLI tool and SOQL.

The main idea is - instead of downloading the whole table, 
select only several fields. However, you can specify so many
records in one statement, so I decided to batch it up.

Specify required fields in **defaultQuery** variable.

File sample.csv should contain id field, which name can specified
in **fieldname** variable

Depends on these npm modules:

csv-parse, csv-stringify 

Run this prior starting the script:

`./force login -i=test -u testuser@company.com.fullcopy -p`


To run the script type:

`node extract.js`

# subset.js

If you already have a large table, but only need specific records you can use: 

`node --max-old-space-size=8192 subset.js`

Required file of all records, that must contain field ID and named all.csv.

Required file of selected record ids, must contain filed External_Id__c 
and named sample.csv


Depends on these npm modules:

csv-parse, csv-stringify 


n.b. to extract a column from a file

`cut -d "\"" -f4 account-promo-code-backup.csv | tr -s '\n' > codes.csv`