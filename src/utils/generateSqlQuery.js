function generateSqlQuery(databaseName, tables) {
    let sql = `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;\nUSE \`${databaseName}\`;\n\n`;
    let foreignKeyStatements = [];

    tables.forEach(table => {
        sql += `CREATE TABLE IF NOT EXISTS \`${table.name}\` (\n`;
        const attributeDefinitions = [];
        const primaryKeyParts = [];

        table.attributes.forEach(attr => {
            let attrSql = `  \`${attr.name}\` ${attr.type}`;
            if (attr.length) {
                attrSql += `(${attr.length})`;
            }
            if (attr.values) {
                attrSql += ` ENUM(${attr.values.map(value => `'${value}'`).join(', ')})`;
            }
            if (attr.constraints.notNull) {
                attrSql += ` NOT NULL`;
            }
            if (attr.constraints.unique) {
                attrSql += ` UNIQUE`;
            }
            if (attr.constraints.unsigned) {
                attrSql += ` UNSIGNED`;
            }
            if (attr.constraints.primaryKey) {
                primaryKeyParts.push(`\`${attr.name}\``);
            }
            if (attr.constraints.autoIncrement) {
                attrSql += ` AUTO_INCREMENT`;
            }
            if (attr.defaultValue) {
                attrSql += ` DEFAULT '${attr.defaultValue}'`;
            }
            if (attr.comment) {
                attrSql += ` COMMENT '${attr.comment}'`;
            }

            attributeDefinitions.push(attrSql);
        });

        if (primaryKeyParts.length > 0) {
            attributeDefinitions.push(`  PRIMARY KEY (${primaryKeyParts.join(', ')})`);
        }

        sql += [...attributeDefinitions].join(",\n") + '\n);\n\n';

        // Prepare FOREIGN KEY statements for later
        table.attributes.forEach(attr => {
            if (attr.constraints.foreignKey && attr.constraints.foreignKey.table && attr.constraints.foreignKey.attribute) {
                const fkStatement = `ALTER TABLE \`${table.name}\` ADD CONSTRAINT ${attr.name} FOREIGN KEY (\`${attr.name}\`) REFERENCES \`${attr.constraints.foreignKey.table}\`(\`${attr.constraints.foreignKey.attribute}\`);\n`;
                foreignKeyStatements.push(fkStatement);
            }
        });
    });

    // Append all foreign key statements after table creation
    sql += foreignKeyStatements.join("\n");

    return sql;
}  

export default generateSqlQuery;
