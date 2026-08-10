USE [404146_CentralUser]
GO
/****** Object:  StoredProcedure [dbo].[DynamicWebsiteThemeColorsbeta]    Script Date: 8/6/2026 5:40:18 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO





ALTER PROCEDURE [dbo].[DynamicWebsiteThemeColorsbeta]
	 @con NVARCHAR(MAX)= '' 	
	,@p NVARCHAR(MAX)= ''
AS
BEGIN
	SET NOCOUNT ON;
	-- dbo.getparam 'DynamicReportbeta'

	DECLARE @FromDate AS DATETIME=isnull([dbo].[UTC_CSERVERLOCAL](getdate()),getdate())
	DECLARE @ProcedureName nvarchar(max)=OBJECT_NAME(@@PROCID)
	DECLARE @spname AS NVARCHAR(MAX)
	SELECT 
		@spname = COALESCE(@spname +char(13)+'	, ', '') + concat(A.name,' = ''', A.value ,'''')
	FROM (		
		SELECT name, value
		FROM (values 
			(1, '@con', replace(cast(@con as NVARCHAR(MAX)),'''','''''')),
			(2, '@p', replace(cast(@p as NVARCHAR(MAX)),'''','''''')),
			(1, '--@con', replace(cast([dbo].Base64Decode(@con) as NVARCHAR(MAX)),'''','''''')),
			(2, '--@p', replace(cast([dbo].Base64Decode(@p) as NVARCHAR(MAX)),'''',''''''))
			) p(num, name, value)
	) AS A(name, value)
	SET @spname=concat('exec [404146_CentralUser].[dbo].',OBJECT_NAME(@@PROCID),' ',@spname)
-------------
	--SET @spname=concat('exec [404146_CentralUser].[dbo].',OBJECT_NAME(@@PROCID),' ',@spname)
	DECLARE 
		  @DBNAME as NVARCHAR(50)=''
		, @id NVARCHAR(50)= ''
		, @mode NVARCHAR(100)= ''		
		, @y NVARCHAR(100)= ''
		, @appuserid NVARCHAR(100)= '' 
		, @IPAddress NVARCHAR(50)= '' 
		, @FormName NVARCHAR(200)= ''
		, @Authorization NVARCHAR(100)= ''
		, @domain NVARCHAR(50)= ''
		, @version as NVARCHAR(10)= ''		
		, @CUVER NVARCHAR(50) = 'beta' , @_CUVER NVARCHAR(50) = ''
		, @UFCC NVARCHAR(50) = ''

	DECLARE @DynamicProcName NVARCHAR(500);
	
	SET @con=[dbo].Base64Decode(@con)
	PRINT CONCAT(' @con : ',@con);

	IF(isnull(@con,'')<>'')
	BEGIN
		DECLARE @conTbl TABLE
		(			
			[id] NVARCHAR(50)
		, [mode] NVARCHAR(100)		
		, [y] NVARCHAR(100)
		, [appuserid] NVARCHAR(100)
		, [IPAddress] NVARCHAR(50)
		, [FormName] NVARCHAR(200)
		, [Authorization] NVARCHAR(100)
		, [domain] NVARCHAR(50)
		, [version] NVARCHAR(10)
		)

		BEGIN TRY
			BEGIN
				INSERT INTO @conTbl
				(
					[id]
				, [mode]
				, [y]
				, [appuserid]
				, [IPAddress]
				, [FormName]
				, [Authorization]
				, [domain]
				, [version]
				)				
				SELECT
						ISNULL([id],0) as [id]
					, ISNULL([mode],'') as [mode]
					, ISNULL([y],'') as [y]
					, ISNULL([appuserid],'') as [appuserid]
					, ISNULL([IPAddress],'') as [IPAddress]
					, ISNULL([FormName],'') as [FormName]
					, ISNULL([Authorization],'') as [Authorization]
					, ISNULL([domain],'') as [domain]
					, ISNULL([version],'') as [version]
				FROM OPENJSON(isnull(@con,''))
				WITH 
				(
						[id] NVARCHAR(50) '$.id'
					, [mode] NVARCHAR(100) '$.mode'		
					, [y] NVARCHAR(100) '$.y'
					, [appuserid] NVARCHAR(100) '$.appuserid'
					, [IPAddress] NVARCHAR(50) '$.IPAddress'
					, [FormName] NVARCHAR(200) '$.FormName'
					, [Authorization] NVARCHAR(100) '$.Authorization'
					, [domain] NVARCHAR(50) '$.domain'
					, [version] NVARCHAR(10) '$.version'
				) AS a

				SELECT TOP 1 
						@id =ISNULL([id],0)
					,@mode =ISNULL([mode],'')
					,@y =ISNULL([y],'')
					,@appuserid =ISNULL([appuserid],'')
					,@IPAddress =ISNULL([IPAddress],'')
					,@FormName =ISNULL([FormName],'')
					,@Authorization =ISNULL([Authorization],'')
					,@domain =ISNULL([domain],'')
					,@version =ISNULL([version],'')
				FROM @conTbl
			END
		END TRY
		BEGIN CATCH	
			PRINT '-------------catch'
		END CATCH;
	END

	
	SET @DBNAME = isnull([dbo].[GetdbName](@y),'404146_CentralUser')	
	Execute [GetTxLog] @spname,@FromDate,@DBNAME,@appuserid,@IPAddress,@FormName,@ProcedureName,@mode

	SELECT 
		@UFCC = UFCC
	FROM [404146_CentralUser].dbo.databasemanagement_SwitchToSample_permission WITH(NOLOCK)
	WHERE dbname = @DBNAME;

	PRINT concat('--@p :',@p)
	PRINT concat('--@DBNAME :',@DBNAME)
	PRINT concat('--@UFCC :',@UFCC)
	PRINT '--step-2'
	--SET @_cuver=ISNULL((
	--	select cuver FROM [404146_CentralUser].dbo.databasemanagement_SwitchToSample_permission
	--	where dbname=@DBNAME
	--),'')
	--PRINT concat('--@CUVER:',@CUVER);
----------------------------------------------------------------------------------------------------------------
	
BEGIN TRY
	
IF(ISNULL(@mode,'')='gettoken')
BEGIN
	DECLARE @GETTOKENSQL AS NVARCHAR(MAX)='
		SELECT 
			dbUniqueKey  as token
			,ISNULL(ukey,'''')  as ukey
			,serverid as sv
			FROM [404146_CentralUser].dbo.databasemanagement_SwitchToSample_permission WITH(NOLOCK)
			WHERE dbname='''+@DBNAME+''';
		';
	PRINT (@GETTOKENSQL);
	EXEC (@GETTOKENSQL);
END
ELSE
BEGIN
	DECLARE 
		  @SQL   NVARCHAR(MAX)=''
		, @SQLA  NVARCHAR(MAX)=''
		, @SQLB  NVARCHAR(MAX)=''
		, @SQLC  NVARCHAR(MAX)=''
		, @SQL1  NVARCHAR(MAX) = ''
		, @SQL2  NVARCHAR(MAX) = ''
		, @SQL3  NVARCHAR(MAX) = ''
		, @SQL4  NVARCHAR(MAX) = ''
		, @SQL5  NVARCHAR(MAX) = ''
		, @SQL6  NVARCHAR(MAX) = ''
		, @SQL7  NVARCHAR(MAX) = ''
		, @SQL8  NVARCHAR(MAX) = ''
		, @SQL9  NVARCHAR(MAX) = ''
		, @SQL10 NVARCHAR(MAX) = ''
		, @SQL11 NVARCHAR(MAX) = ''
		, @SQL12 NVARCHAR(MAX) = ''
		, @SQL13 NVARCHAR(MAX) = ''
		, @SQL14 NVARCHAR(MAX) = ''
		, @SQL15 NVARCHAR(MAX) = ''
		, @SQL16 NVARCHAR(MAX) = ''
		, @SQL17 NVARCHAR(MAX) = ''
		, @SQL18 NVARCHAR(MAX) = ''
		, @SQL19 NVARCHAR(MAX) = ''
		, @SQL20 NVARCHAR(MAX) = ''


		, @WhereClause AS NVARCHAR(MAX)=''
		, @WhereClause1 AS NVARCHAR(MAX)=''
		, @UserId INT =0
		--------------------------------------
		, @ReportId INT = 0
		, @IsMaster INT = 0
		, @FilterHeader NVARCHAR(MAX) = ''
		, @FilterValue NVARCHAR(MAX) = ''
		, @ServerFilterHeader NVARCHAR(MAX) = ''
		, @ServerFilterValue NVARCHAR(MAX) = ''
		, @count AS INT = 0
		, @col AS NVARCHAR(200) = ''
		, @col1 AS NVARCHAR(200) = ''
		, @ForEvt nvarchar(200)=''
		, @MasterId nvarchar(200)=''
		, @JoinId NVARCHAR(20)= '' 
		, @ColumnNameList NVARCHAR(200)=''
		, @DisplayName NVARCHAR(200)=''
		, @Tablename VARCHAR(300)=''
		, @FriendlyName NVARCHAR(200)=''
		, @colvalue NVARCHAR(MAX) = '' 
		, @Whereflag INT = 0
		, @ToCheckLargeData INT = 0
		, @MasterType NVARCHAR(200) = ''
		, @LargeDataCount INT = 0
		, @IsLargeDataReport BIT = 0
		---------------------------------------------

		, @ReportName NVARCHAR(200) = ''
		, @ColId INT = 0
		, @FieldName NVARCHAR(200) = ''
		, @HeaderName NVARCHAR(200) = ''
		, @FilterStartDate DATE = ''
		, @FilterEndDate DATE = ''
		------------------------------------------------------
		, @ProcJson NVARCHAR(MAX) = ''

		-- ADD THESE FOR THE TOGGLE ACTION:
		, @IsActionData NVARCHAR(50) = ''
		, @State NVARCHAR(100) = 0
		, @RecordID NVARCHAR(MAX) = ''
		, @SQLQuery NVARCHAR(MAX) = ''
		, @isAuthActionId INT = 0;

	
	IF(ISNULL(@p,'')<>'')
	BEGIN
		DECLARE @PTbl TABLE
		(
			  ReportName           NVARCHAR(200)
			, ReportId             INT
			, IsMaster             INT
			, Job_customerfirmname NVARCHAR(MAX)
			, FilterHeader		   NVARCHAR(MAX)
			, FilterValue		   NVARCHAR(MAX)
			, ServerFilterHeader   NVARCHAR(MAX)
			, ServerFilterValue	   NVARCHAR(MAX)
			, UserId               INT
			, LargeDataCount       INT
			, IsLargeDataReport	   INT
			, ColId                INT
			, FieldName            NVARCHAR(200)
			, HeaderName           NVARCHAR(200)
			, FilterStartDate      DATE
			, FilterEndDate			DATE

		)
		BEGIN TRY
			BEGIN
				INSERT INTO @PTbl
				(
					ReportName
					, ReportId
					, IsMaster
					, Job_customerfirmname
					, FilterHeader		  
					, FilterValue		  
					, ServerFilterHeader		  
					, ServerFilterValue	
					, UserId
					, LargeDataCount
					, IsLargeDataReport
					, ColId
					, FieldName
					, HeaderName
					, FilterStartDate
					, FilterEndDate
				)				
				SELECT 
					 ISNULL(ReportName, '')              AS ReportName
					,ISNULL(ReportId, 0)                 AS ReportId
					,ISNULL(IsMaster, 0)                 AS IsMaster
					,ISNULL(Job_customerfirmname, 0)     AS Job_customerfirmname
					,ISNULL(FilterHeader, '')            AS FilterHeader
					,ISNULL(FilterValue, '')             AS FilterValue
					,ISNULL(ServerFilterHeader, '')      AS ServerFilterHeader
					,ISNULL(ServerFilterValue, '')       AS ServerFilterValue
					,ISNULL(UserId, 0)                   AS UserId
					,ISNULL(IsLargeDataReport,0)		 AS IsLargeDataReport
					,ISNULL(LargeDataCount, 0)           AS LargeDataCount
					,ISNULL(ColId, 0)                    AS ColId
					,ISNULL(FieldName, '')               AS FieldName
					,ISNULL(HeaderName, '')              AS HeaderName
					,ISNULL(FilterStartDate, '')         AS FilterStartDate
					,ISNULL(FilterEndDate, '')           AS FilterEndDate
				FROM OPENJSON(ISNULL(@p, ''))
				WITH
				(
					 ReportName           NVARCHAR(200)    '$.ReportName'
					,ReportId             INT              '$.ReportId'
					,IsMaster             INT              '$.IsMaster'
					,Job_customerfirmname NVARCHAR(MAX)	   '$.Job_customerfirmname'
					,FilterHeader         NVARCHAR(MAX)	   '$.FilterHeader'
					,FilterValue          NVARCHAR(MAX)	   '$.FilterValue'
					,ServerFilterHeader   NVARCHAR(MAX)	   '$.ServerFilterHeader'
					,ServerFilterValue    NVARCHAR(MAX)	   '$.ServerFilterValue'
					,UserId               INT              '$.UserId'
					,IsLargeDataReport    INT			   '$.IsLargeDataReport'
					,LargeDataCount       INT              '$.LargeDataCount'
					,ColId                INT              '$.ColId'
					,FieldName            NVARCHAR(200)    '$.FieldName'
					,HeaderName           NVARCHAR(200)    '$.HeaderName'
					,FilterStartDate      NVARCHAR(200)    '$.FilterStartDate'
					,FilterEndDate		  NVARCHAR(200)    '$.FilterEndDate'
				) AS a;
				SELECT TOP 1
					 @ReportName           = ReportName
					,@ReportId             = ReportId
					,@IsMaster             = IsMaster
					,@FilterHeader         = FilterHeader
					,@FilterValue           = FilterValue
					,@ServerFilterHeader    = ServerFilterHeader
					,@ServerFilterValue     = ServerFilterValue
					,@UserId               = UserId
					,@LargeDataCount       = LargeDataCount
					,@IsLargeDataReport	   = IsLargeDataReport
					,@ColId                = ColId
					,@FieldName            = FieldName
					,@HeaderName           = HeaderName
					,@FilterStartDate      = FilterStartDate
					,@FilterEndDate      = FilterEndDate
				FROM @PTbl;

				SET @SQL = N'
					SELECT @outUserId = ISNULL((
						SELECT id 
						FROM [' + @DBNAME + '].[dbo].Usermanagement_systemloginmaster WITH (NOLOCK)
						WHERE userid = @appuserid
					),0);
				';

				EXEC sp_executesql 
					@SQL,
					N'@appuserid NVARCHAR(100), @outUserId INT OUTPUT',
					@appuserid = @appuserid,
					@outUserId = @UserId OUTPUT;
			END
		END TRY
		BEGIN CATCH	
			PRINT '--------CATCH--------';
			PRINT ERROR_MESSAGE();
		END CATCH;
	END

	-- EXTRACT TOGGLE PARAMETERS FROM @p JSON

	IF (ISNULL(@mode, '') = 'ToggelAction' AND ISNULL(@p, '') <> '')
	BEGIN
		SET @IsActionData = ISNULL(JSON_VALUE(@p, '$.IsActionData'), '');
		SET @RecordID = ISNULL(JSON_VALUE(@p, '$.RecordID'), '');
		SET @isAuthActionId = ISNULL(CAST(JSON_VALUE(@p, '$.isAuthActionId') AS INT),0);
		SET @State = CASE 
			WHEN @isAuthActionId = 4 THEN JSON_VALUE(@p, '$.State')
			ELSE CAST(ISNULL(CAST(JSON_VALUE(@p, '$.State') AS BIT), 0) AS NVARCHAR(MAX))
		END;
	END

PRINT CONCAT('@ReportName        ',@ReportName        ) 
PRINT CONCAT('@ReportId          ',@ReportId          ) 
PRINT CONCAT('@IsMaster          ',@IsMaster          ) 
PRINT CONCAT('@FilterHeader      ',@FilterHeader      ) 
PRINT CONCAT('@FilterValue       ',@FilterValue       ) 
PRINT CONCAT('@ServerFilterHeader',@ServerFilterHeader) 
PRINT CONCAT('@ServerFilterValue ',@ServerFilterValue ) 
PRINT CONCAT('@UserId            ',@UserId			  ) 
PRINT CONCAT('@LargeDataCount    ',@LargeDataCount    ) 
PRINT CONCAT('@IsLargeDataReport ',@IsLargeDataReport )	 
PRINT CONCAT('@ColId             ',@ColId             ) 
PRINT CONCAT('@FieldName         ',@FieldName         ) 
PRINT CONCAT('@HeaderName        ',@HeaderName        )      
PRINT CONCAT('@FilterStartDate   ',@FilterStartDate   )   
PRINT CONCAT('@FilterEndDate     ',@FilterEndDate     )   

BEGIN
	IF(ISNULL(@mode,'') = 'getUrlParams')
	BEGIN
		SET @SQL1 = '
		SELECT 
			VariableName
			,VariableValue
			,case when 
				IsStatic = 1 then ''true'' else ''false'' 
			end as IsStatic 
		from 
		[404146_CentralUser].[dbo].[DynamicReport_RedirectColumn]
		where ReportId = '+cast(@ReportId as nvarchar(4))+' 
		--and Colid = '+CAST(iif(@ColId = 0,0,@Colid)as nvarchar(12))+'
			SELECT
				1 AS stat,
				''Sp Name list Get successfully'' AS stat_msg,
				1000 AS stat_code;
		';

		select 'mfg/app/InventoryManagement_invoiceList' as ReportRedirectUrl, 'http://nzen/R50B3/'as BaseUrl;
    
		PRINT(@SQL1);
		EXEC(@SQL1);
	END

	--get active theme color 
	ELSE IF (ISNULL(@mode, '') = 'gettheme')
	BEGIN
		DECLARE @ThemeDomain NVARCHAR(100) = COALESCE(
			NULLIF(@domain, ''),
			NULLIF(JSON_VALUE(@p, '$.domain_name'), ''),
			NULLIF(JSON_VALUE(@p, '$.domain'), ''),
			NULLIF(JSON_VALUE(@con, '$.domain_name'), ''),
			NULLIF(JSON_VALUE(@con, '$.domain'), ''),
			''
		);

		DECLARE @ThemeUFCC NVARCHAR(100) = COALESCE(
			NULLIF(JSON_VALUE(@p, '$.ufcc'), ''),
			NULLIF(JSON_VALUE(@p, '$.UFCC'), ''),
			NULLIF(JSON_VALUE(@con, '$.ufcc'), ''),
			NULLIF(JSON_VALUE(@con, '$.UFCC'), ''),
			NULLIF(@UFCC, ''),
			''
		);

		IF (@ThemeDomain = '' OR @ThemeUFCC = '')
		BEGIN
			SELECT 0 AS stat, 'Domain name and UFCC are required.' AS stat_msg;
		END
		ELSE
		BEGIN
			IF EXISTS (
				SELECT 1 
				FROM [404146_CentralUser].dbo.ProcatalogStoreThemeConfig WITH (NOLOCK)
				WHERE domain_name = @ThemeDomain AND ufcc = @ThemeUFCC
			)
			BEGIN
				SELECT TOP 1 *
				FROM [404146_CentralUser].dbo.ProcatalogStoreThemeConfig WITH (NOLOCK)
				WHERE domain_name = @ThemeDomain AND ufcc = @ThemeUFCC;
			END
			ELSE
			BEGIN
				SELECT 0 AS stat, 'No theme found for the provided Domain name and UFCC.' AS stat_msg;
			END
		END
	END
	--end

	ELSE IF(@mode = 'GetFullReport')
	BEGIN
		PRINT CONCAT('MODE','GetFullReport');
		CREATE TABLE #tempcolumnnames
		(
			Number INT IDENTITY(1,1),
			temp_fieldname NVARCHAR(200),
			MasterId NVARCHAR(200),
			TableName NVARCHAR(200),
			JoinId NVARCHAR(20),
			ColumnNameList NVARCHAR(200),
			DisplayName NVARCHAR(200),
			Friendlyname NVARCHAR(200)
		);
		DECLARE  @TempTable TABLE
		(
			Number int identity(1,1)
		    ,FilterHeader VARCHAR(100)
		    ,FilterValue VARCHAR(MAX)
		);
		DECLARE  @ServerTempTable TABLE
		(
			Number int identity(1,1)
		    ,FilterHeader VARCHAR(100)
		    ,FilterValue VARCHAR(MAX)
		);

		DECLARE @SQL_TempColumns NVARCHAR(MAX);

		-- 4. Build the query
		-- NOTE: The single quotes around '0' and '1' are doubled up here!
		SET @SQL_TempColumns = N'
			INSERT INTO #tempcolumnnames  
				(temp_fieldname, MasterId, TableName, JoinId, ColumnNameList, DisplayName, Friendlyname)
			SELECT
				a.FieldName, a.MasterId, b.TableName, b.JoinId, b.ColumnNameList, b.DisplayName, a.Friendlyname
			FROM
			(
				SELECT FieldName, MasterId, Friendlyname
				FROM DynamicReport_ColumnSettings_' + @cuver + N' WITH (NoLock)
				WHERE ISNULL(ReportId, 0) = @ParamReportId 
				  AND ISNULL(IsLargeDataGroup, ''0'') = ''1''  
				  AND ISNULL(HideColumn, 0) <> ''1''
			) AS a
			LEFT OUTER JOIN (
				SELECT id, TableName, JoinId, ColumnNameList, DisplayName
				FROM DynamicReport_MasterTableList_' + @cuver + N' WITH (NoLock)
			) AS b
				ON a.MasterId = b.id;
		';

		-- 5. Execute and map the parameter
		EXEC sp_executesql 
			@stmt = @SQL_TempColumns, 
			@params = N'@ParamReportId INT', 
			@ParamReportId = @ReportId;

		DECLARE @N INT = 1;
		SELECT @Count = MAX(Number) FROM #tempcolumnnames
		
		--SELECt * FROM #tempcolumnnames

		IF(@IsMaster = '1')
		BEGIN
			WHILE @count >= @N
			BEGIN
				SET @Tablename=''
				SET @JoinId=0
				SET @ColumnNameList=''
				
				SELECT 
					@col = temp_fieldname 
					,@MasterId=isnull(MasterId,0)
					,@Tablename=isnull(TableName,'')
					,@JoinId=JoinId
					,@ColumnNameList=isnull(ColumnNameList,'')
					,@DisplayName=isnull(DisplayName,'')
					,@FriendlyName=isnull(Friendlyname,'')
				FROM #tempcolumnnames
				WHERE Number=@N;

				DECLARE @DynamicTableName NVARCHAR(200);

				SET @DynamicTableName = 'DynamicReportData_' + @col;
				
				IF(ISNULL(@col,'') <> '')
				BEGIN
					IF(@col = 'CustomerName')
					BEGIN
						SET @SQL1 = '
							IF OBJECT_ID('''+@DynamicTableName+''') IS NULL
							BEGIN
								PRINT(''-- Create table and load distinct values'');
								SELECT DISTINCT 
										CONCAT(Job_customerfirstname, '' '', Job_customerlastname) AS ['+ CAST(@col AS NVARCHAR(MAX)) +']
										,'+'''0'''+' as MasterId
										,'''+ concat(isnull(@col,0),'') +''' as MasterType
										,'''+concat(isnull(@FriendlyName,0),'')+''' as FriendlyName
										,GETDATE() AS InsertedAt
								INTO '+@DynamicTableName+'
								FROM ['+@DBNAME+'].dbo.JobManagement_JobMaster WITH (NOLOCK)
								WHERE Job_customerfirstname <> '''' OR Job_customerlastname <> '''';
							END
							ELSE IF NOT EXISTS (SELECT 1 FROM '+@DynamicTableName+')
							BEGIN
								PRINT(''-- Table exists but empty reload'');
								INSERT INTO '+@DynamicTableName+'
								SELECT DISTINCT 
										CONCAT(Job_customerfirstname, '' '', Job_customerlastname) AS CustomerName
										,'+'''0'''+' as MasterId
										,'''+ concat(isnull(@col,0),'') +''' as MasterType
										,'''+concat(isnull(@FriendlyName,0),'')+''' as FriendlyName
										,GETDATE() AS InsertedAt
								FROM ['+@DBNAME+'].dbo.JobManagement_JobMaster WITH (NOLOCK)
								WHERE Job_customerfirstname <> '''' OR Job_customerlastname <> '''';
							END

							-- Always read from the temporary table
							SELECT [' + @col + '], MasterId, MasterType, FriendlyName 
							FROM ' + @DynamicTableName + ';
						';
					END
					ELSE 
					BEGIN
						IF(ISNULL(@MasterId,0)<>0)
						BEGIN
							SET @SQL1 ='';
							SET @SQL1 += '
								SELECT DISTINCT ISNULL('+ CAST(@ColumnNameList AS NVARCHAR(MAX)) +','''') as ['+ CAST(@DisplayName AS NVARCHAR(MAX)) +']
								,' + concat(isnull(@JoinId,0),'')+' as ' + CAST(@col AS NVARCHAR(MAX)) + '
								,'+concat(isnull(@MasterId,0),'')+' as MasterId
								,'''+concat(isnull(@col,0),'')+''' as MasterType
								,'''+concat(isnull(@FriendlyName,0),'')+''' as FriendlyName
								FROM  ['+@DBNAME+'].dbo.'+@Tablename+' WITH (NOLOCK)
							'
						END
						ELSE	
						BEGIN
							SET @SQL1 = '
								IF OBJECT_ID('''+@DynamicTableName+''') IS NULL
								BEGIN
									PRINT(''-- Create table and load distinct values'');
									SELECT DISTINCT 
												ISNULL('+ CAST(@col AS NVARCHAR(MAX)) +','''') AS ['+ CAST(@col AS NVARCHAR(MAX)) +']
											,'+'''0'''+' as MasterId
											,'''+ concat(isnull(@col,0),'') +''' as MasterType
											,'''+concat(isnull(@FriendlyName,0),'')+''' as FriendlyName
											,GETDATE() AS InsertedAt
									INTO '+@DynamicTableName+'
									FROM ['+@DBNAME+'].dbo.JobManagement_JobMaster WITH (NOLOCK)
								END
								ELSE IF NOT EXISTS (SELECT 1 FROM '+@DynamicTableName+')
								BEGIN
									PRINT(''-- Table exists but empty reload'');
									INSERT INTO '+@DynamicTableName+'
									SELECT DISTINCT 
											ISNULL('+ CAST(@col AS NVARCHAR(MAX)) +','''') AS ['+ CAST(@col AS NVARCHAR(MAX)) +']
											,'+'''0'''+' as MasterId
											,'''+ concat(isnull(@col,0),'') +''' as MasterType
											,'''+concat(isnull(@FriendlyName,0),'')+''' as FriendlyName
											,GETDATE() AS InsertedAt
									FROM ['+@DBNAME+'].dbo.JobManagement_JobMaster WITH (NOLOCK)
									
								END

								-- Read from the temporary table
								SELECT [' + @col + '], MasterId, MasterType, FriendlyName 
								FROM ' + @DynamicTableName + ';
							';
						END
					END
				END
				PRINT CONCAT(' @IsMaster : ',@IsMaster);
				PRINT CONCAT('@SQL1 : ',@SQL1);
				EXEC(@SQL1);

			    SET @N = @N + 1;
			END;
		END
--------------------------------------------------------=====================================SERVER Side Filter Started
		ELSE IF(@IsMaster = '-1')
		BEGIN
			SET @ServerFilterHeader = REPLACE(@ServerFilterHeader, '###', '|');
			SET @ServerFilterValue  = REPLACE(@ServerFilterValue, '###', '|');

------------------------------------------=================================================Server Side Where Clause
			IF(@ServerFilterHeader <> '' AND @ServerFilterValue <> '')
			BEGIN 
				
				;WITH HeaderCTE AS (
				    SELECT TRIM(value) AS HeaderValue, ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum
				    FROM STRING_SPLIT(@ServerFilterHeader, '|')
				),
				ValueCTE AS (
				    SELECT TRIM(value) AS FilterValue, ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum
				    FROM STRING_SPLIT(@ServerFilterValue, '|')
				),
				TransformedValues AS (
				    SELECT 
				        v.RowNum,
				        v.FilterValue,
				        STRING_AGG(CONCAT('''', TRIM(value), ''''), ',') AS TransformedFilterValue
				    FROM ValueCTE v
				    CROSS APPLY STRING_SPLIT(v.FilterValue, ',') s
				    GROUP BY v.RowNum, v.FilterValue
				)

				INSERT INTO @ServerTempTable (FilterHeader, FilterValue)
				SELECT h.HeaderValue,  t.TransformedFilterValue
				FROM HeaderCTE h
				JOIN TransformedValues t ON h.RowNum = t.RowNum
				WHERE h.HeaderValue <> '' ;
		
				--SELECT * FROM @ServerTempTable;
				SET @N = 1;
				SELECT @count = max(Number) FROM @ServerTempTable

				PRINT CONCAT('@Server count : ',@count);
---------------------------------------------------------------------------------------------------------------------------------------		
				
				WHILE @count >= @N
				BEGIN
					
					SELECT @col = FilterHeader 
					FROM @ServerTempTable
					WHERE Number = @N;

					SELECT @colvalue = FilterValue 
					FROM @ServerTempTable 
					WHERE FilterHeader = ''+CAST(@col AS VARCHAR(MAX))+ '';

					IF(ISNULL(@col,'') = 'CustomerName')
					BEGIN
						SET @WhereClause +='
							 ( concat(ISNULL(Job_customerfirstname,''''),'' '',ISNULL(Job_customerlastname,''''))  IN (' + @colvalue + '))
						';
						SET @Whereflag = 1;
					END
					ELSE IF(ISNULL(@col,'') = 'DesignSize')
					BEGIN
						SET @WhereClause += '
						    ( ISNULL((
						        CASE 
						            WHEN mastermanagement_categoryid = 1 THEN ISNULL(Ring_FingerSize, '''')
						            WHEN mastermanagement_categoryid = 2 THEN ISNULL(Pendent_BailType, '''')
						            WHEN mastermanagement_categoryid = 3 THEN ISNULL(Bracelet_length, '''')
						            WHEN mastermanagement_categoryid = 4 THEN ISNULL(Bangel_InsideDiameter, '''')
						            WHEN mastermanagement_categoryid = 5 THEN ISNULL(Earring_length, '''')
						            WHEN mastermanagement_categoryid = 6 THEN ISNULL(Necklace_length, '''')
						            WHEN mastermanagement_categoryid = 7 THEN ISNULL(Misc_FingerSize, '''')
						            ELSE ISNULL(othersize, '''')
						        END), '''') IN (' + @colvalue + '))
						';
						SET @Whereflag = 1;
					END
					ELSE 
					BEGIN
						If(@col <> '')
						BEGIN
							SET @WhereClause += '
									( ISNULL('+ @col +','''') IN ('+ @colvalue +'))
							';
						END
						SET @Whereflag = 1;
					END
					
					IF(@Whereflag = '1' AND @N < @count )
					BEGIN 
						SET @WhereClause += ' OR ';
					END 
	
					SET @N = @N + 1;
				END;
			END;
			ELSE 
			BEGIN
				SET @WhereClause = '1=1'
			END
-----------------------------------------===================================================NorMal Page Filter Where Clause
			IF(@FilterHeader <> '' AND @FilterValue <> '')
			BEGIN 
	
				;WITH HeaderCTE AS (
				    SELECT TRIM(value) AS HeaderValue, ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum
				    FROM STRING_SPLIT(@FilterHeader, '#')
				),
				ValueCTE AS (
				    SELECT TRIM(value) AS FilterValue, ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum
				    FROM STRING_SPLIT(@FilterValue, '#')
				),
				TransformedValues AS (
				    SELECT 
				        v.RowNum,
				        v.FilterValue,
				        STRING_AGG(CONCAT('''', TRIM(value), ''''), ',') AS TransformedFilterValue
				    FROM ValueCTE v
				    CROSS APPLY STRING_SPLIT(v.FilterValue, ',') s
				    GROUP BY v.RowNum, v.FilterValue
				)
				
				
				INSERT INTO @TempTable (FilterHeader, FilterValue)
				SELECT h.HeaderValue,  t.TransformedFilterValue
				FROM HeaderCTE h
				JOIN TransformedValues t ON h.RowNum = t.RowNum
				WHERE h.HeaderValue <> '' ;
	
				--SELECT * FROM @TempTable;
				SET @N = 1;
				SELECT @count = max(Number) FROM @TempTable

				PRINT CONCAT('@Normal Page Filter count : ',@count);
---------------------------------------------------------------------------------------------------------------------------------------		
				
				WHILE @count >= @N
				BEGIN
					
					SELECT @col = FilterHeader 
					FROM @TempTable
					WHERE Number = @N;

					SELECT @colvalue = FilterValue 
					FROM @TempTable 
					WHERE FilterHeader = ''+CAST(@col AS VARCHAR(MAX))+ '';


					IF(ISNULL(@col,'') = 'CustomerName')
					BEGIN
						SET @WhereClause1 +='
							 ( concat(ISNULL(Job_customerfirstname,''''),'' '',ISNULL(Job_customerlastname,''''))  IN (' + @colvalue + '))
						';
						SET @Whereflag = 1;
					END
					ELSE IF(ISNULL(@col,'') = 'DesignSize')
					BEGIN
						SET @WhereClause1 += '
						    ( ISNULL(DesignSize, '''') IN (' + @colvalue + '))
						';
						SET @Whereflag = 1;
					END
					ELSE 
					BEGIN
						If(@col <> '')
						BEGIN
							SET @WhereClause1 += '
									( ISNULL('+ @col +','''') IN ('+ @colvalue +'))
							';
						END
						SET @Whereflag = 1;
					END
					
					IF(@Whereflag = '1' AND @N < @count )
					BEGIN 
						SET @WhereClause1 += ' AND ';
					END 
	
					SET @N = @N + 1;
				END;
			END;

			ELSE 
			BEGIN
				SET @WhereClause1 = '1=1'
			END
----------------------------------------------------------------------------------------------------------------------
			IF(@FilterStartDate IS NOT NULL AND @FilterEndDate IS NOT NULL and @FilterStartDate <> '1900-01-01' and @FilterEndDate <>'1900-01-01')
			BEGIN
				SET @WhereClause1 = ' jobdate BETWEEN ''' 
									+ CONVERT(varchar(10), @FilterStartDate, 120) 
									+ ''' AND ''' 
									+ CONVERT(varchar(10), @FilterEndDate, 120) + ' 23:59:59''';
			END

--------------------------------------------------------------------------------------------------------------------
			PRINT CONCAT('---------------------------------Server Side-------@Whereclause : ',@WhereClause);
			PRINT CONCAT('---------------------------------Normal Page-------@Whereclause1 : ',@WhereClause1);

			SET @ProcJson = 
				'[{"ReportId": "' + CAST(@ReportId AS NVARCHAR(20)) + '",' +
				'"DBNAME":"' + @DBNAME + '",' +
				'"UserId":"' + CAST(@UserId AS NVARCHAR(20)) + '"}]';

			SET @DynamicProcName = N'[404146_CentralUser].[dbo].[DynamicReportDetails' + @cuver + N']';

					-- 3. Execute the procedure by calling the variable directly
					EXEC @DynamicProcName
						@Farr = @ProcJson,
						@appuserid = @appuserid,
						@IPAddress = @IPAddress,
						@FormName = @FormName;
---------------------------------------------------------------------------------------------------------------------
			SET @SQL5 = '
					SELECT 
						''store_id''						as [1]
						,''domain_name''					as [2]
						,''primary_theme_color''			as [3]
						,''primary_theme_bg''				as [4]
						,''sticky_header_bg''				as [5]
						,''btn_main_bg''					as [6]
						,''btn_main_text''					as [7]
						,''btn_main_border''				as [8]
						,''btn_product_bg''					as [9]
						,''btn_product_text''					as [10]
						,''btn_product_border''					as [11]
						,''btn_product_border_radius''			as [12]
						,''btn_remove_cart_bg''					as [13]
						,''btn_remove_cart_text''				as [14]
						,''btn_remove_cart_border''				as [15]
						,''btn_remove_cart_border_radius''		as [16]
						,''icon_color''							as [17]
						,''icon_remove_color''					as [18]
						,''created_at''							as [19]
						,''updated_at''							as [20]
				';

				SET @SQL6 = '

					;with dvtbl as(
						select
							[store_id]
						   ,[domain_name]
						   ,[primary_theme_color]
						   ,[primary_theme_bg]
						   ,[sticky_header_bg]
						   ,[btn_main_bg]
						   ,[btn_main_text]
						   ,[btn_main_border]
						   ,[btn_product_bg]
						   ,[btn_product_text]
						   ,[btn_product_border]
						   ,[btn_product_border_radius]
						   ,[btn_remove_cart_bg]
						   ,[btn_remove_cart_text]
						   ,[btn_remove_cart_border]
						   ,[btn_remove_cart_border_radius]
						   ,[icon_color]
						   ,[icon_remove_color]
						   ,[created_at]
						   ,[updated_at]
						from [404146_CentralUser].dbo.ProcatalogStoreThemeConfig with (nolock)
						WHERE ufcc = '''+ @UFCC +'''
					)
				'

				SET @SQL7 = '
					SELECT 
						[store_id]								AS [1]
						,[domain_name]							AS [2]
						,[primary_theme_color]					AS [3]
						,[primary_theme_bg]						AS [4]
						,[sticky_header_bg]						AS [5]
						,[btn_main_bg]							AS [6]
						,[btn_main_text]						AS [7]
						,[btn_main_border]						AS [8]
						,[btn_product_bg]						AS [9]
						,[btn_product_text]						AS [10]
						,[btn_product_border]					AS [11]
						,[btn_product_border_radius]			AS [12]
						,[btn_remove_cart_bg]					AS [13]
						,[btn_remove_cart_text]					AS [14]
						,[btn_remove_cart_border]				AS [15]
						,[btn_remove_cart_border_radius]		AS [16]
						,[icon_color]							AS [17]
						,[icon_remove_color]					AS [18]
						,[created_at]							AS [19]
						,[updated_at]							AS [20]
					from dvtbl
				'

			PRINT CONCAT('@SQL1',@SQL1);
			PRINT CONCAT('@SQL2',@SQL2);
			PRINT CONCAT('@SQL3',@SQL3);
			PRINT CONCAT('@SQL4',@SQL4);
			PRINT CONCAT('@SQL5',@SQL5);
			PRINT CONCAT('@SQL6',@SQL6);
			EXEC(@SQL1 + @SQL2 + @SQL3 + @SQL4 + @SQL5 + @SQL6);

		END
--------------------------------------------------------===================================== Else Block Started	
		ELSE 
		BEGIN
			IF(@FilterHeader <> '' AND @FilterValue <> '')
			BEGIN 
				;WITH HeaderCTE AS (
				    SELECT TRIM(value) AS HeaderValue, ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum
				    FROM STRING_SPLIT(@FilterHeader, '#')
				),
				ValueCTE AS (
				    SELECT TRIM(value) AS FilterValue, ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum
				    FROM STRING_SPLIT(@FilterValue, '#')
				),
				TransformedValues AS (
				    SELECT 
				        v.RowNum,
				        v.FilterValue,
				        STRING_AGG(CONCAT('''', TRIM(value), ''''), ',') AS TransformedFilterValue
				    FROM ValueCTE v
				    CROSS APPLY STRING_SPLIT(v.FilterValue, ',') s
				    GROUP BY v.RowNum, v.FilterValue
				)

				INSERT INTO @TempTable (FilterHeader, FilterValue)
				SELECT h.HeaderValue,  t.TransformedFilterValue
				FROM HeaderCTE h
				JOIN TransformedValues t ON h.RowNum = t.RowNum
				WHERE h.HeaderValue <> '' ;
	
				--SELECT * FROM @TempTable;
				SET @N = 1;
				SELECT @count = max(Number) FROM @TempTable

				PRINT CONCAT('@count : ',@count);
---------------------------------------------------------------------------------------------------------------------------------------		
				
				WHILE @count >= @N
				BEGIN
					
					SELECT @col = FilterHeader 
					FROM @TempTable
					WHERE Number = @N;

					SELECT @colvalue = FilterValue 
					FROM @TempTable 
					WHERE FilterHeader = ''+CAST(@col AS VARCHAR(MAX))+ '';

					IF(ISNULL(@col,'') = 'CustomerName')
					BEGIN
						SET @WhereClause +='
							 ( concat(ISNULL(Job_customerfirstname,''''),'' '',ISNULL(Job_customerlastname,''''))  IN (' + @colvalue + '))
						';
						SET @Whereflag = 1;
					END
					ELSE IF(ISNULL(@col,'') = 'DesignSize')
					BEGIN
						SET @WhereClause += '
						    ( ISNULL((
						        CASE 
						            WHEN mastermanagement_categoryid = 1 THEN ISNULL(Ring_FingerSize, '''')
						            WHEN mastermanagement_categoryid = 2 THEN ISNULL(Pendent_BailType, '''')
						            WHEN mastermanagement_categoryid = 3 THEN ISNULL(Bracelet_length, '''')
						            WHEN mastermanagement_categoryid = 4 THEN ISNULL(Bangel_InsideDiameter, '''')
						            WHEN mastermanagement_categoryid = 5 THEN ISNULL(Earring_length, '''')
						            WHEN mastermanagement_categoryid = 6 THEN ISNULL(Necklace_length, '''')
						            WHEN mastermanagement_categoryid = 7 THEN ISNULL(Misc_FingerSize, '''')
						            ELSE ISNULL(othersize, '''')
						        END), '''') IN (' + @colvalue + '))
						';
						SET @Whereflag = 1;
					END
					ELSE 
					BEGIN
						If(@col <> '')
						BEGIN
							SET @WhereClause += '
									( ISNULL('+ @col +','''') IN ('+ @colvalue +'))
							';
						END
						SET @Whereflag = 1;
					END
					
					IF(@Whereflag = '1' AND @N < @count )
					BEGIN 
						SET @WhereClause += ' AND ';
					END 
	
					SET @N = @N + 1;
				END;
			END;

			ELSE 
			BEGIN
				SET @WhereClause = '1=1'
			END
			
			IF(@FilterStartDate IS NOT NULL AND @FilterEndDate IS NOT NULL and @FilterStartDate <> '1900-01-01' and @FilterEndDate <>'1900-01-01')
			BEGIN
				SET @WhereClause1 = 'and  jobdate BETWEEN ''' 
									+ CONVERT(varchar(10), @FilterStartDate, 120) 
									+ ''' AND ''' 
									+ CONVERT(varchar(10), @FilterEndDate, 120) + ' 23:59:59''';
			END
			DECLARE  @ActualCount INT;
				
			DECLARE @DynamicSQL NVARCHAR(MAX);
			DECLARE @ParamDefinition NVARCHAR(MAX);

			-- 1. Construct the query string, appending the @cuver variable to the table name
			SET @DynamicSQL = N'
				SELECT @LargeDataCount_OUT = LargeDataCount
					  ,@ToCheckLargeData_OUT = IsLargeDataReport
				FROM [404146_CentralUser].[dbo].DynamicReport_ReportDetails_' + @cuver + N'
				WHERE ReportId = CAST(@ReportId_IN AS NVARCHAR(20));';

			-- 2. Define the parameters used inside the dynamic query
			-- (Please adjust INT or BIT below if your actual variables use different data types)
			SET @ParamDefinition = N'
				@ReportId_IN NVARCHAR(20), 
				@LargeDataCount_OUT INT OUTPUT, 
				@ToCheckLargeData_OUT BIT OUTPUT';

			-- 3. Execute the dynamic query and map the output back to your original variables
			EXEC sp_executesql 
				@stmt = @DynamicSQL, 
				@params = @ParamDefinition, 
				@ReportId_IN = @ReportId, 
				@LargeDataCount_OUT = @LargeDataCount OUTPUT, 
				@ToCheckLargeData_OUT = @ToCheckLargeData OUTPUT;
				
			SET @SQLA = '
				SELECT 
					@ActualCountOUT = COUNT(*)
				FROM [404146_CentralUser].dbo.ProcatalogStoreThemeConfig a WITH (NOLOCK)
				WHERE 1=1 AND ('+@WhereClause+')
			';
			EXEC sp_executesql 
				@SQLA,
				N'@ActualCountOUT INT OUTPUT',
				@ActualCount OUTPUT;

			PRINT CONCAT('@ActualCount : ',@ActualCount, ' @LargeDataCount : ',@LargeDataCount, ' @ToCheckLargeData : ',@ToCheckLargeData);
			PRINT CONCAT('@Whereclause : ',@WhereClause);
				
			SET @ToCheckLargeData = 0
			IF(@ToCheckLargeData = '1')
			BEGIN
				PRINT CONCAT('CheckLargeData : ',@ToCheckLargeData);
				IF(@ActualCount <> '0')
				BEGIN
					IF (@LargeDataCount > @ActualCount)
					BEGIN
-----------------------------------------------------------------------------------------------------------
					SET @ProcJson = 
						'[{"ReportId": "' + CAST(@ReportId AS NVARCHAR(20)) + '",' +
						'"DBNAME":"' + @DBNAME + '",' +
						'"UserId":"' + CAST(@UserId AS NVARCHAR(20)) + '"}]';

					SET @DynamicProcName = N'[404146_CentralUser].[dbo].[DynamicReportDetails' + @cuver + N']';

					-- 3. Execute the procedure by calling the variable directly
					EXEC @DynamicProcName
						@Farr = @ProcJson,
						@appuserid = @appuserid,
						@IPAddress = @IPAddress,
						@FormName = @FormName;
-------------------------------------------------------------------------------------------------------------------------
						SET @SQL5 = '
							SELECT 
								''store_id''						as [1]
								,''domain_name''					as [2]
								,''primary_theme_color''			as [3]
								,''primary_theme_bg''				as [4]
								,''sticky_header_bg''				as [5]
								,''btn_main_bg''					as [6]
								,''btn_main_text''					as [7]
								,''btn_main_border''				as [8]
								,''btn_product_bg''					as [9]
								,''btn_product_text''					as [10]
								,''btn_product_border''					as [11]
								,''btn_product_border_radius''			as [12]
								,''btn_remove_cart_bg''					as [13]
								,''btn_remove_cart_text''				as [14]
								,''btn_remove_cart_border''				as [15]
								,''btn_remove_cart_border_radius''		as [16]
								,''icon_color''							as [17]
								,''icon_remove_color''					as [18]
								,''created_at''							as [19]
								,''updated_at''							as [20]
						';

						SET @SQL6 = '

							;with dvtbl as(
								select
									[store_id]
								   ,[domain_name]
								   ,[primary_theme_color]
								   ,[primary_theme_bg]
								   ,[sticky_header_bg]
								   ,[btn_main_bg]
								   ,[btn_main_text]
								   ,[btn_main_border]
								   ,[btn_product_bg]
								   ,[btn_product_text]
								   ,[btn_product_border]
								   ,[btn_product_border_radius]
								   ,[btn_remove_cart_bg]
								   ,[btn_remove_cart_text]
								   ,[btn_remove_cart_border]
								   ,[btn_remove_cart_border_radius]
								   ,[icon_color]
								   ,[icon_remove_color]
								   ,[created_at]
								   ,[updated_at]
								from [404146_CentralUser].dbo.ProcatalogStoreThemeConfig with (nolock)
								WHERE ufcc = '''+ @UFCC +'''
							)
						'

						SET @SQL7 = '
							SELECT 
								[store_id]								AS [1]
								,[domain_name]							AS [2]
								,[primary_theme_color]					AS [3]
								,[primary_theme_bg]						AS [4]
								,[sticky_header_bg]						AS [5]
								,[btn_main_bg]							AS [6]
								,[btn_main_text]						AS [7]
								,[btn_main_border]						AS [8]
								,[btn_product_bg]						AS [9]
								,[btn_product_text]						AS [10]
								,[btn_product_border]					AS [11]
								,[btn_product_border_radius]			AS [12]
								,[btn_remove_cart_bg]					AS [13]
								,[btn_remove_cart_text]					AS [14]
								,[btn_remove_cart_border]				AS [15]
								,[btn_remove_cart_border_radius]		AS [16]
								,[icon_color]							AS [17]
								,[icon_remove_color]					AS [18]
								,[created_at]							AS [19]
								,[updated_at]							AS [20]
							from dvtbl
						'
						PRINT CONCAT('@SQL1 : ',@SQL1);
						PRINT CONCAT('@SQL2 : ',@SQL2);
						PRINT CONCAT('@SQL3 : ',@SQL3);
						PRINT CONCAT('@SQL4 : ',@SQL4);
						PRINT CONCAT('@SQL5 : ',@SQL5);
						PRINT CONCAT('@SQL6 : ',@SQL6);
						EXEC(@SQL1+@SQL2+@SQL3+@SQL4+@SQL5+@SQL6);
					END
					ELSE
					BEGIN
						SELECT 0 AS stat,
						'Records are larger than your limit' as stat_msg
						,@ActualCount as ActualCount
						,@LargeDataCount as LargeDataCount;

					END
				END
				ELSE
				BEGIN
					SELECT 2 AS stat,
						'Records Not available for your filter' as stat_msg;
				END
			END
			ELSE 
			BEGIN
----------------------------------------------------------------------------------------------------------------------
				SET @ProcJson = 
					'[{"ReportId": "' + CAST(@ReportId AS NVARCHAR(20)) + '",' +
					'"DBNAME":"' + @DBNAME + '",' +
					'"UserId":"' + CAST(@UserId AS NVARCHAR(20)) + '"}]';

				SET @DynamicProcName = N'[404146_CentralUser].[dbo].[DynamicReportDetails' + @cuver + N']';

					-- 3. Execute the procedure by calling the variable directly
					EXEC @DynamicProcName
						@Farr = @ProcJson,
						@appuserid = @appuserid,
						@IPAddress = @IPAddress,
						@FormName = @FormName;
---------------------------------------------------------------------------------------------------------------------
				SET @SQL5 = '
					SELECT 
						''store_id''						as [1]
						,''domain_name''					as [2]
						,''primary_theme_color''			as [3]
						,''primary_theme_bg''				as [4]
						,''sticky_header_bg''				as [5]
						,''btn_main_bg''					as [6]
						,''btn_main_text''					as [7]
						,''btn_main_border''				as [8]
						,''btn_product_bg''					as [9]
						,''btn_product_text''					as [10]
						,''btn_product_border''					as [11]
						,''btn_product_border_radius''			as [12]
						,''btn_remove_cart_bg''					as [13]
						,''btn_remove_cart_text''				as [14]
						,''btn_remove_cart_border''				as [15]
						,''btn_remove_cart_border_radius''		as [16]
						,''icon_color''							as [17]
						,''icon_remove_color''					as [18]
						,''created_at''							as [19]
						,''updated_at''							as [20]
				';

				SET @SQL6 = '

					;with dvtbl as(
						select
							[store_id]
						   ,[domain_name]
						   ,[primary_theme_color]
						   ,[primary_theme_bg]
						   ,[sticky_header_bg]
						   ,[btn_main_bg]
						   ,[btn_main_text]
						   ,[btn_main_border]
						   ,[btn_product_bg]
						   ,[btn_product_text]
						   ,[btn_product_border]
						   ,[btn_product_border_radius]
						   ,[btn_remove_cart_bg]
						   ,[btn_remove_cart_text]
						   ,[btn_remove_cart_border]
						   ,[btn_remove_cart_border_radius]
						   ,[icon_color]
						   ,[icon_remove_color]
						   ,[created_at]
						   ,[updated_at]
						from [404146_CentralUser].dbo.ProcatalogStoreThemeConfig with (nolock)
						WHERE ufcc = '''+ @UFCC +'''
					)
				'

				SET @SQL7 = '
					SELECT 
						[store_id]								AS [1]
						,[domain_name]							AS [2]
						,[primary_theme_color]					AS [3]
						,[primary_theme_bg]						AS [4]
						,[sticky_header_bg]						AS [5]
						,[btn_main_bg]							AS [6]
						,[btn_main_text]						AS [7]
						,[btn_main_border]						AS [8]
						,[btn_product_bg]						AS [9]
						,[btn_product_text]						AS [10]
						,[btn_product_border]					AS [11]
						,[btn_product_border_radius]			AS [12]
						,[btn_remove_cart_bg]					AS [13]
						,[btn_remove_cart_text]					AS [14]
						,[btn_remove_cart_border]				AS [15]
						,[btn_remove_cart_border_radius]		AS [16]
						,[icon_color]							AS [17]
						,[icon_remove_color]					AS [18]
						,[created_at]							AS [19]
						,[updated_at]							AS [20]
					from dvtbl
				'
						

				PRINT CONCAT('--@SQL1 : ',@SQL1)
				PRINT CONCAT('--@SQL2 : ',@SQL2)
				PRINT CONCAT('--@SQL3 : ',@SQL3)
				PRINT CONCAT('--@SQL4 : ',@SQL4)
				PRINT CONCAT('--@SQL5 : ',@SQL5)
				PRINT CONCAT('--@SQL6 : ',@SQL6)
				PRINT CONCAT('--@SQL7 : ',@SQL7)
				EXEC(@SQL1+@SQL2+@SQL3+@SQL4+@SQL5+@SQL6+@SQL7)
			END
		END
	
		-----DROP Temporary Table
		IF OBJECT_ID('tempdb..#tempcolumnnames') IS NOT NULL
		BEGIN
		    DROP TABLE #tempcolumnnames
		END
			
		IF OBJECT_ID('tempdb..#TempTable') IS NOT NULL
		BEGIN
			DROP TABLE #TempTable;
		END
	END

---------------------------------------------------------------------------------------------

	ELSE IF(@mode = 'GetFullMaster')
	BEGIN
		CREATE TABLE #MasterTable
		(
			Number INT IDENTITY(1,1),
			Tablename NVARCHAR(300),
			MasterId INT,
			MasterType NVARCHAR(200),
			JoinId NVARCHAR(20),
			ColumnNameList NVARCHAR(200)
		); 
		
		DECLARE @SQL_Master NVARCHAR(MAX);

		-- 3. Build the query, adding the dynamic database name and handling double-quotes
		SET @SQL_Master = N'
			INSERT INTO #MasterTable
				(Tablename, MasterId, MasterType, JoinId, ColumnNameList)
			SELECT
				tab.TableName, tab.Id, tab.DisplayName, tab.JoinId, tab.ColumnNameList 
			FROM
			(
				SELECT 
					col.MasterId
				FROM [404146_CentralUser].dbo.DynamicReport_ColumnSettings_' + @cuver + N' AS col WITH (NoLock)
				WHERE ReportId = @ParamReportId AND ISNULL(col.MasterId, '''') <> ''''
			) AS col
			INNER JOIN [404146_CentralUser].dbo.DynamicReport_MasterTableList_' + @cuver + N' AS tab WITH (NoLock)
				ON tab.Id = col.MasterId;
		';

		-- 4. Execute and map the parameter
		EXEC sp_executesql 
			@stmt = @SQL_Master, 
			@params = N'@ParamReportId INT', 
			@ParamReportId = @ReportId;
		
		SET @N = 1
		SELECT @count = max(Number) FROM #MasterTable
	
		SELECT MasterId
		,MasterType
		--,JoinId
		FROM #MasterTable;
		
		SET @SQL1 = '';
	
		--PRINT CONCAT('--count : ', @count);
		WHILE @count >= @N
		BEGIN
			set @Tablename=''
			set @MasterType=''
			set @MasterId=0
			SELECT @Tablename = Tablename
				,@joinid = JoinId
				,@MasterType=MasterType
				,@MasterId=MasterId
				,@ColumnNameList=ColumnNameList
			FROM #MasterTable
			where Number=@N
			PRINT CONCAT('@ColumnNameList : ',@ColumnNameList);
			IF (ISNULL(@ColumnNameList,'') <> '')
			BEGIN
				SET @SQL1 += '
					SELECT 	
						'+concat(isnull(@MasterId,0),'')+' as MasterId
						--,'''+@MasterType+''' as MasterType
						,'+concat(isnull(@joinid,0),'')+' as id
						,'+@ColumnNameList+' as ValName
					FROM ['+@DBNAME+'].dbo.'+@Tablename+'  WITH(NOLOCK)
				' 
			END
			SET @N = @N+1;
		END
	
		PRINT CONCAT('@SQL1 : ',@SQL1);
		DROP TABLE IF EXISTS #MasterTable;
				
		EXEC (@SQL1);
	END

	ELSE IF (ISNULL(@mode, '') = 'ToggelAction')
	BEGIN
		PRINT CONCAT('--IsActionData : ',@IsActionData);
		PRINT CONCAT('--State : ',@State);
		PRINT CONCAT('--RecordID : ',@RecordID);
		PRINT CONCAT('--isAuthActionId : ',@isAuthActionId);

		IF (ISNULL(@IsActionData, '') = 'domain_name' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					domain_name = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'primary_theme_color' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					primary_theme_color = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'primary_theme_bg' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					primary_theme_bg = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'sticky_header_bg' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					sticky_header_bg = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_main_bg' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_main_bg = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_main_text' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_main_text = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_main_border' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_main_border = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_product_bg' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_product_bg = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_product_text' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_product_text = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_product_border' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_product_border = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_product_border_radius' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_product_border_radius = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_remove_cart_bg' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_remove_cart_bg = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_remove_cart_text' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_remove_cart_text = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_remove_cart_border' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_remove_cart_border = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'btn_remove_cart_border_radius' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					btn_remove_cart_border_radius = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'icon_color' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					icon_color = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END
		ELSE IF (ISNULL(@IsActionData, '') = 'icon_remove_color' AND @isAuthActionId = 4)
		BEGIN
			SET @SQLQuery = N'
				UPDATE 
					[404146_CentralUser].dbo.ProcatalogStoreThemeConfig
				SET 
					icon_remove_color = @pState
				WHERE 
					store_id = @pRecordID;';

			SELECT 1 AS stat, 'Action applied successfully.' AS stat_msg;
		END

		ELSE
		BEGIN
			SELECT 0 AS stat, 'Unknown Action Data passed.' AS stat_msg;
		END





		EXEC sp_executesql 
            @stmt = @SQLQuery,
            @params = N'@pState NVARCHAR(MAX), @pRecordID NVARCHAR(MAX)',
            @pState = @State,
            @pRecordID = @RecordID;
		
	END

	ELSE
	BEGIN
		SET @SQL1 = '
			SELECt 0 as stat, ''Invalid Mode'' as stat_msg
		'
		PRINT(@SQL1);
		EXEC(@SQL1);
	END

END
END

-----------------------------------------------------------------------------------------------------------------	
Execute [GetTxLog] @spname,@FromDate,@DBNAME,@appuserid,@IPAddress,@FormName,@ProcedureName,@mode
END TRY
BEGIN CATCH	
	
	SELECT 
		0 as stat
		,'"Contact yours Admin"' as stat_msg
		,1001 as stat_code
		,'null' as device_token
	
	EXECUTE [GetErrlog] @appuserid,@FromDate,@DBNAME,@spname,@IPAddress,@FormName,@ProcedureName,@mode;
END CATCH;
END
